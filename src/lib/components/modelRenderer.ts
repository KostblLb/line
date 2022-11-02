import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";
import { makeProgram, Program } from "../../ui/canvas/utils";

import fragSource from "../../shaders/basic/fragment.frag"; // todo check multiple imports
import vertSource from "../../shaders/basic/vertex.vert";

export type ModelRendererComponentProps = {
  shaderSource: string;
  shaderType: "vertex" | "fragment";
};

// encapsulates shader parameters passing
// creates program from passed context,
// then gives parameters for the program on demand
export class ModelRendererComponent extends Component {
  static Name = "ModelRenderer";

  private renderTargets: {
    glContext: WebGL2RenderingContext;
    program: Program<any, any>;
  }[] = [];

  toJSON(): Object {
    return {
      uid: this.uid,
      name: this.name,
    };
  }

  constructor(parent: SceneObject) {
    super(parent, ModelRendererComponent.Name);
  }

  init(props: ModelRendererComponentProps, uid?: string | undefined): void {
    Reflect.set(this, "uid", uid ?? utils.uid());
  }

  addRenderTarget(glContext: WebGL2RenderingContext) {
    const program = makeProgram({
      gl: glContext,
      fragmentShader: fragSource,
      vertexShader: vertSource,
      attribs: ["aVertexPosition"],
      uniforms: ["uModelView", "uCameraView", "uProjection"],
    });

    if (!program) {
      throw new Error("Cannot add render target, program not created");
    }

    return program;
  }

  getRenderParameters() {
    throw new Error("Not implemented!");
  }
}
