import { mat4, vec3 } from "gl-matrix";

import { makeProgram, Program } from "./utils";
import { getPointAt } from "./getPointAt";

import { Scene } from "../../lib/scene";
import { PCustomElement } from "../../lib/customElement";

import demoVert from "../../shaders/basic/vertex.vert";
import demoFrag from "../../shaders/basic/fragment.frag";
import clickDetectionFrag from "../../shaders/clickDetection/fragment.frag";

import demoModel from "../../models/demo.json";
import { ModelComponent } from "../../lib/components/model";

// it paints the Scene

export class Canvas extends PCustomElement {
  // html stuff
  static OBJECT_CLICKED_EVENT = "OBJECT_CLICKED_EVENT";
  static observedAttributes = ["modelviewx", "modelviewy", "modelviewz"];
  private root: ShadowRoot;

  // gl stuff
  private sceneObjects = new Map<
    string,
    {
      vao: WebGLVertexArrayObject | null;
      indicesLength: number;
      modelView: mat4;
    }
  >();

  private programs: {
    drawing: Program<
      {
        aVertexPosition: any;
      },
      {
        uModelView: any;
        uCameraView: any;
        uProjection: any;
      }
    > | null;

    offscreen: Program<
      {
        aVertexPosition: any;
      },
      {
        uModelView: any;
        uCameraView: any;
        uProjection: any;
        uIdColor: any;
      }
    > | null;
  } = {
    drawing: null,
    offscreen: null,
  };

  private cameraView: mat4; // shared across shaders
  private projection: mat4; // shared across shaders

  // app stuff
  private scene?: Scene;
  private models = new Map<string, { verts: number[]; indices: number[] }>();

  constructor() {
    super();

    this.root = this.attachShadow({
      mode: "closed",
    });

    this.root.innerHTML = `
<canvas style="
  width: 100%;
  height: 100%">
</canvas>
<div id="error" style="position:absolute; display:none;">WebGL is not supported in your browser</div>`;

    this.canvas.onclick = ({ offsetX, offsetY }) => {
      console.log(offsetX, offsetY);
      if (!this.programs.offscreen?.program) {
        throw new Error("no program for click detection");
      }

      this.getGLContext().useProgram(this.programs.offscreen?.program);
      const id = getPointAt(offsetX, offsetY, this.getGLContext(), () =>
        this.drawOffscreen()
      );
      this.getGLContext().useProgram(this.programs.drawing?.program ?? null);

      this.dispatchEvent(
        new CustomEvent<number>(Canvas.OBJECT_CLICKED_EVENT, { detail: id })
      );
    };

    this.cameraView = mat4.create();
    this.projection = mat4.create();
  }

  async connectedCallback() {
    this.setupCanvas();

    this.setupCommonResources();

    await this.setupPrograms();

    this.setupProjection();

    this.getGLContext().useProgram(this.programs.drawing!.program);

    super.runConnectedCallbacks();

    this.viewParamsChanged();
  }

  attributeChangedCallback() {
    this.viewParamsChanged();
  }

  private get canvas() {
    return this.root.querySelector("canvas") as HTMLCanvasElement;
  }

  private getGLContext() {
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("no gl context!");
    }
    return gl;
  }

  private setupCanvas() {
    const context = this.getGLContext();

    if (!context) {
      (this.root.querySelector("error") as HTMLDivElement).style.display =
        "block";
      return;
    }

    const resizeCallback = (entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[entries.length - 1].contentRect;
      this.canvas.width = width;
      this.canvas.height = height;
      this.setupProjection();
      this.viewParamsChanged();
    };
    const observer = new ResizeObserver(resizeCallback);
    observer.observe(this.canvas);
  }

  private setupCommonResources() {
    const { name, verts, indices } = demoModel;
    this.models.set(name, { verts, indices });
  }

  // TODO will be called on each addition \ removal from scene objects. WILL GET SLOWER
  setScene(scene: Scene) {
    console.log(scene);

    const gl = this.getGLContext();
    this.scene = scene;

    // Setting up position attribute location for each program
    for (const prog of [this.programs.drawing, this.programs.offscreen]) {
      gl.useProgram(prog?.program!);

      gl.uniformMatrix4fv(
        prog?.uniformLocations?.uProjection ?? -1,
        true,
        this.projection
      );

      for (const obj of scene.objects) {
        const modelComponent = obj.findComponentByClass(ModelComponent);

        if (!modelComponent) {
          continue;
        }

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const model = this.models.get(modelComponent.modelName);
        if (!model) {
          throw new Error(
            `Model use in scene not found: ${modelComponent.modelName}`
          );
        }

        // Setting up the VBO
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(model.verts),
          gl.STATIC_DRAW
        );

        // first bind buffer, then enable vertex attrib array
        gl.enableVertexAttribArray(
          prog?.attribLocations?.aVertexPosition ?? -1
        );
        gl.vertexAttribPointer(
          prog?.attribLocations?.aVertexPosition ?? -1,
          3,
          gl.FLOAT,
          false,
          0,
          0
        );

        // Setting up the IBO
        const objIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objIndexBuffer);
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(model.indices),
          gl.STATIC_DRAW
        );

        const {
          offset: { x, y, z },
        } = modelComponent;
        const modelView = mat4.fromTranslation(
          new Float32Array(16),
          vec3.fromValues(x, y, z)
        );

        this.sceneObjects.set(obj.id, {
          vao,
          modelView,
          indicesLength: model.indices.length,
        });
      }

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  private async setupPrograms() {
    this.programs.drawing = await this.setupGlProgram(
      demoVert,
      demoFrag,
      ["aVertexPosition"],
      ["uModelView", "uCameraView", "uProjection"]
    );

    this.programs.offscreen = await this.setupGlProgram(
      demoVert,
      clickDetectionFrag,
      ["aVertexPosition"],
      ["uModelView", "uCameraView", "uProjection", "uIdColor"]
    );
  }

  private async setupGlProgram<A extends {}, U extends {}>(
    vertShaderUrl: string,
    fragShaderUrl: string,
    attribs: (keyof A)[],
    uniforms: (keyof U)[]
  ) {
    const vertexShader = await (await fetch(vertShaderUrl)).text();
    const fragmentShader = await (await fetch(fragShaderUrl)).text();

    const gl = this.getGLContext();
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const program = makeProgram({
      gl,
      vertexShader,
      fragmentShader,
      attribs,
      uniforms,
    });

    if (!program?.program) {
      throw new Error("No program created");
    }

    return program;
  }

  drawOnscreen() {
    const gl = this.getGLContext();
    gl.useProgram(null);
    gl.useProgram(this.programs.drawing!.program);
    // DRAW
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.getGLContext().uniformMatrix4fv(
      this.programs.drawing!.uniformLocations?.uCameraView ?? -1,
      false,
      this.cameraView ?? mat4.create()
    );

    // foreach objec in scene
    // bind its vao, draw elements based on indices

    this.scene!.objects.forEach((obj, i) => {
      const sceneObj = this.sceneObjects.get(obj.id);
      if (!sceneObj) {
        throw new Error(`Scene object not found during draw: ${obj.id}`);
      }

      gl.uniformMatrix4fv(
        this.programs.drawing?.uniformLocations?.uModelView ?? -1,
        false,
        sceneObj.modelView
      );

      gl.bindVertexArray(sceneObj.vao);

      gl.drawElements(
        gl.TRIANGLES,
        sceneObj.indicesLength,
        gl.UNSIGNED_SHORT,
        0
      );
    });

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  drawOffscreen() {
    const gl = this.getGLContext();
    gl.useProgram(this.programs.offscreen!.program);

    // DRAW
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.getGLContext().uniformMatrix4fv(
      this.programs.offscreen!.uniformLocations?.uCameraView ?? -1,
      false,
      this.cameraView ?? mat4.create()
    );

    // foreach objec in scene
    // bind its vao, draw elements based on indices

    this.scene!.objects.forEach((obj, i) => {
      const sceneObj = this.sceneObjects.get(obj.id);
      if (!sceneObj) {
        throw new Error(`Scene object not found during draw: ${obj.id}`);
      }

      gl.uniformMatrix4fv(
        this.programs.offscreen?.uniformLocations?.uModelView ?? -1,
        false,
        sceneObj.modelView
      );

      const colorId = i + 1;
      gl.uniform3fv(this.programs.offscreen?.uniformLocations?.uIdColor ?? -1, [
        colorId & (0xff0000 << 16),
        colorId & (0xff00 << 8),
        colorId & 0xff,
      ]);

      gl.bindVertexArray(sceneObj.vao);

      gl.drawElements(
        gl.TRIANGLES,
        sceneObj.indicesLength,
        gl.UNSIGNED_SHORT,
        0
      );
    });

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  private setupProjection() {
    const gl = this.getGLContext();
    const currentProg = gl.getParameter(gl.CURRENT_PROGRAM);

    this.projection = mat4.create();
    mat4.perspective(
      this.projection,
      0.5,
      gl.canvas.width / gl.canvas.height,
      -1.2,
      1000
    );

    for (const prog of [this.programs.drawing, this.programs.offscreen]) {
      if (!prog) {
        break;
      }

      gl.useProgram(prog!.program);

      this.getGLContext().uniformMatrix4fv(
        prog!.uniformLocations?.uProjection ?? -1,
        true,
        this.projection ?? mat4.create()
      );
    }

    gl.useProgram(currentProg);
  }

  setCamera(camera: mat4) {
    const m = mat4.create();
    mat4.invert(m, camera);
    this.cameraView = m;

    this.viewParamsChanged();
  }

  private viewParamsChanged() {
    if (!this.programs.drawing) {
      return;
    }
    this.drawOnscreen();
  }
}

customElements.define("p-canvas", Canvas);
