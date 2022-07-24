import { makeProgram } from "./utils";
import { mat4, vec3 } from "gl-matrix";

import { Scene } from "../../lib/scene";
import { PCustomElement } from "../../lib/customElement";

import demoVert from "../../shaders/basic/vertex.vert";
import demoFrag from "../../shaders/basic/fragment.frag";
import demoModel from "../../models/demo.json";

// it paints the Scene

export class Canvas extends PCustomElement {
  // html stuff
  static observedAttributes = ["modelviewx", "modelviewy", "modelviewz"];
  private root: ShadowRoot;

  // gl stuff
  private vao: WebGLVertexArrayObject | null = null;
  private sceneObjects = new Map<
    string,
    {
      vao: WebGLVertexArrayObject | null;
      indicesLength: number;
      modelView: mat4;
    }
  >();
  private currentProgram?: any;
  private cameraView: mat4;

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

    this.cameraView = mat4.create();
  }

  async connectedCallback() {
    this.setupCanvas();
    await this.setupGlProgram();
    this.setupCommonResources();

    super.runConnectedCallbacks();

    this.viewParamsChanged();
  }

  attributeChangedCallback(
    attributeName: string,
    oldValue: string | undefined,
    newValue: string
  ) {
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
    };
    const observer = new ResizeObserver(resizeCallback);
    observer.observe(this.canvas);
  }

  private setupCommonResources() {
    const { name, verts, indices } = demoModel;
    this.models.set(name, { verts, indices });
  }

  setScene(scene: Scene) {
    const gl = this.getGLContext();
    this.scene = scene;

    for (const obj of scene.objects) {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      const model = this.models.get(obj.id);
      if (!model) {
        throw new Error(`Model use in scene not found: ${obj.id}`);
      }

      // Setting up the VBO
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(model.verts),
        gl.STATIC_DRAW
      );

      // Setting up position attribute location
      gl.enableVertexAttribArray(
        this.currentProgram?.attribLocations?.aVertexPosition ?? -1
      );
      gl.vertexAttribPointer(
        this.currentProgram?.attribLocations?.aVertexPosition ?? -1,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );

      // gl.uniformMatrix4fv(
      //   program?.uniformLocations?.uModelView ?? -1,
      //   false,
      //   this.modelView
      // );

      // Setting up the IBO
      const squareIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(model.indices),
        gl.STATIC_DRAW
      );

      const modelView = mat4.fromTranslation(
        new Float32Array(16),
        vec3.fromValues(obj.offset.x, obj.offset.y, obj.offset.z)
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

  async setupGlProgram() {
    const vertexShader = await (await fetch(demoVert)).text();
    const fragmentShader = await (await fetch(demoFrag)).text();

    const gl = this.getGLContext();
    gl.clearDepth(100);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const program = makeProgram({
      gl,
      vertexShader,
      fragmentShader,
      attribs: ["aVertexPosition"],
      uniforms: ["uModelView", "uCameraView"],
    });
    this.currentProgram = program;
  }

  draw() {
    const gl = this.getGLContext();
    // DRAW
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // foreach objec in scene
    // bind its vao, draw elements based on indices

    for (const obj of this.scene!.objects) {
      const sceneObj = this.sceneObjects.get(obj.id);
      if (!sceneObj) {
        throw new Error(`Scene object not found during draw: ${obj.id}`);
      }

      this.getGLContext().uniformMatrix4fv(
        this.currentProgram?.uniformLocations?.uModelView ?? -1,
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

      const err = gl.getError();
      if (err) {
        console.warn(err);
      }
    }

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  private viewParamsChanged() {
    if (!this.currentProgram) {
      return;
    }

    /* пересадить на кватернионы? */
    const newCameraView = mat4.create();
    mat4.rotateX(
      newCameraView,
      newCameraView,
      Number(this.getAttribute("modelviewx"))
    );

    mat4.rotateY(
      newCameraView,
      newCameraView,
      Number(this.getAttribute("modelviewy"))
    );

    mat4.rotateZ(
      newCameraView,
      newCameraView,
      Number(this.getAttribute("modelviewz"))
    );

    this.cameraView = newCameraView;
    this.getGLContext().uniformMatrix4fv(
      this.currentProgram?.uniformLocations?.uCameraView ?? -1,
      false,
      this.cameraView
    );

    this.draw();
  }
}

customElements.define("p-canvas", Canvas);
