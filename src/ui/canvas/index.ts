import { mat4 } from "gl-matrix";

import { PCustomElement } from "../../lib/customElement";
import type { IMaterial } from "../../lib/rendering/types";
import type { IDevice } from "../types";
import { makeProgram } from "./utils";

// it paints the Scene

export class Canvas extends PCustomElement implements IDevice {
  // html stuff
  static OBJECT_CLICKED_EVENT = "OBJECT_CLICKED_EVENT";
  static observedAttributes = ["modelviewx", "modelviewy", "modelviewz"];

  private root: ShadowRoot;

  private cameraView: mat4; // shared across shaders
  private projection: mat4; // shared across shaders

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
    this.projection = mat4.create();
  }

  async connectedCallback() {
    this.setupCanvas();
    this.setupProjection();
    super.runConnectedCallbacks();
  }

  attributeChangedCallback() {}

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
    };

    const observer = new ResizeObserver(resizeCallback);
    observer.observe(this.canvas);

    const gl = this.getGLContext();
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  // shiiiieeeeeeet
  matVaos = new Map<IMaterial, WebGLVertexArrayObject>();
  matPrograms = new Map<string, WebGLProgram>();

  // inits gl program for all material instances
  compileMaterial(material: IMaterial) {
    if (this.matPrograms.has(material.name)) {
      return;
    }

    const gl = this.getGLContext();

    const program = makeProgram({
      gl,
      vertexShader: material.shaderDecl.vertSource,
      fragmentShader: material.shaderDecl.fragSource,
    });

    if (!program) {
      throw new Error(
        `Cannot compile material to gl program: ${material.shaderDecl}`
      );
    }

    this.matPrograms.set(material.name, program);

    return program;
  }

  private makeVao(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    material: IMaterial,
    attrib: { type: string; name: string; value: any }
  ) {
    const attribLocation = gl.getAttribLocation(program, attrib.name);
    if (attribLocation === null) {
      throw new Error(
        `Not found attribLocation for ${attrib.type} ${attrib.name}`
      );
    }

    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("Could not create vertex array object");
    }
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attrib.value.verts),
      gl.STATIC_DRAW
    );

    // first bind buffer, then enable vertex attrib array
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);

    // Setting up the IBO
    const objIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objIndexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(attrib.value.indices),
      gl.STATIC_DRAW
    );

    // cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.matVaos.set(material, vao);

    return vao;
  }

  clear() {
    const gl = this.getGLContext();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  render(material: IMaterial) {
    const gl = this.getGLContext();

    const program =
      this.matPrograms.get(material.name) ?? this.compileMaterial(material);

    if (!program) {
      throw new Error(`Cannot render material ${material.name}`);
    }

    const params = material.getParametersValues();

    gl.useProgram(program);

    // bind global camera
    const globCameraLocation = gl.getUniformLocation(
      program,
      "uGlobCameraView"
    );
    if (globCameraLocation) {
      gl.uniformMatrix4fv(
        globCameraLocation,
        false,
        this.cameraView ?? mat4.create()
      );
    }

    // bind global projection
    const globProjectionLocation = gl.getUniformLocation(
      program,
      "uGlobProjection"
    );
    if (globProjectionLocation) {
      gl.uniformMatrix4fv(
        globProjectionLocation,
        true,
        this.projection ?? mat4.create()
      );
    }

    for (const uniform of params.uniforms) {
      const uniformLocation = gl.getUniformLocation(program, uniform.name);
      if (uniformLocation === null) {
        throw new Error(
          `Not found uniformLocation for ${uniform.type} ${uniform.name}`
        );
      }
      if (uniform.type === "mat4") {
        gl.uniformMatrix4fv(uniformLocation, false, uniform.value);
      }
    }

    for (const attrib of params.attribs) {
      const attribLocation = gl.getAttribLocation(program, attrib.name);
      if (attribLocation === null) {
        throw new Error(
          `Not found attribLocation for ${attrib.type} ${attrib.name}`
        );
      }

      if (attrib.type === "vao") {
        const vao =
          this.matVaos.get(material) ??
          this.makeVao(gl, program, material, attrib);

        if (!vao) {
          throw new Error("Could not get vao for material");
        }

        gl.bindVertexArray(vao);

        gl.drawElements(
          gl.TRIANGLES,
          attrib.value.indices.length,
          gl.UNSIGNED_SHORT,
          0
        );

        gl.bindVertexArray(null);
      }
    }

    // Clean
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  private setupProjection() {
    const gl = this.getGLContext();

    this.projection = mat4.create();
    mat4.perspective(
      this.projection,
      0.5,
      gl.canvas.width / gl.canvas.height,
      -1.2,
      1000
    );
  }

  setCamera(camera: mat4) {
    const m = mat4.create();
    mat4.invert(m, camera);
    this.cameraView = m;
  }
}

customElements.define("p-canvas", Canvas);
