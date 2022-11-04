import { mat4, vec3 } from "gl-matrix";
import { makeProgram } from "../../ui/canvas/utils";
import { ModelComponent } from "../components/model";
import { TransformComponent } from "../components/transform";
import type { IMaterial } from "./types";

import fragSource from "../../shaders/basic/fragment.frag";
import vertSource from "../../shaders/basic/vertex.vert";
import { SceneObject } from "../sceneObject";

export class BasicMaterial implements IMaterial {
  private component!: ModelComponent; // dependency from concrete class, is it bad?

  constructor(sceneObject: SceneObject) {
    const modelComponent = sceneObject.findComponentByClass(ModelComponent);
    if (!modelComponent) {
      throw new Error("Model component not found on scene object!");
    }
    this.component = modelComponent;
  }

  addDevice(glContext: WebGL2RenderingContext) {
    const program = makeProgram({
      gl: glContext,
      fragmentShader: fragSource,
      vertexShader: vertSource,
      attribs: ["aVertexPosition"],
      uniforms: ["uModelView", "uGlobCameraView", "uGlobProjection"],
    });

    if (!program) {
      throw new Error("Cannot add render target, program not created");
    }

    return program;
  }

  getParametersValues() {
    const transform =
      this.component.parent.findComponentByClass(TransformComponent);

    const modelOffsetVec = this.component.offset
      ? vec3.fromValues(
          this.component.offset.x,
          this.component.offset.y,
          this.component.offset.z
        )
      : vec3.create();

    const positionVec = transform
      ? vec3.fromValues(
          transform.position.x,
          transform.position.y,
          transform.position.z
        )
      : vec3.create();

    const modelView = transform
      ? mat4.fromRotationTranslation(
          new Float32Array(16),
          transform.rotation,
          vec3.add(vec3.create(), modelOffsetVec, positionVec)
        )
      : mat4.create();

    return {
      attribs: {
        aVertexPosition: {
          indices: this.component.data.indices,
          verts: this.component.data.verts,
        },
      },
      uniforms: {
        uModelView: modelView,
      },
    };
  }
}
