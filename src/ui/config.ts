import { mat4 } from "gl-matrix";

export type CameraConfig = {
  rotx: string;
  roty: string;
  rotz: string;
  offset: string;
};

type UIConfigType = {
  camera: CameraConfig;
};

export class UIConfig {
  private static LocalStorageKey = "UIConfig";

  static load(): UIConfigType | null {
    const configStr = localStorage.getItem(UIConfig.LocalStorageKey);
    if (!configStr) {
      return null;
    }

    return JSON.parse(configStr);
  }

  static save(config: UIConfigType) {
    const configJson = JSON.stringify(config);

    localStorage.setItem(UIConfig.LocalStorageKey, configJson);
  }
}
