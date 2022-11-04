import { mat4 } from "gl-matrix";

export type MaterialAttribParameter = {
  name: string;
  type: "vao";
  value: {
    verts: number[];
    indices: number[];
  };
};

export type MaterialUniformParameter = {
  name: string;
  type: "mat4";
  value: mat4;
};

export interface IMaterial {
  name: string;

  shaderDecl: {
    vertSource: string;
    fragSource: string;
  };

  getParametersValues(): {
    attribs: MaterialAttribParameter[];
    uniforms: MaterialUniformParameter[];
  };
}
