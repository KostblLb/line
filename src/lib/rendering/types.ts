import type { Program } from "../../ui/canvas/utils";

export interface IMaterial {
  addDevice(device: WebGL2RenderingContext): Program<any, any>;

  getParametersValues(): {
    attribs: Record<string, any>;
    uniforms: Record<string, any>;
  };
}
