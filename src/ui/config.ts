import { merge } from "lodash";

export type CameraConfig = {
  rotx: string | number;
  roty: string | number;
  rotz: string | number;
  offset: string | number;
};

export type UIConfigType = {
  camera: CameraConfig;
};

const defaultConfig: UIConfigType = {
  camera: {
    rotx: 0,
    roty: 0,
    rotz: 0,
    offset: -10,
  },
};

export class UIConfig {
  private static LocalStorageKey = "UIConfig";

  static load(): UIConfigType | null {
    const configStr = localStorage.getItem(UIConfig.LocalStorageKey);
    if (!configStr) {
      return defaultConfig;
    }

    return merge({}, defaultConfig, JSON.parse(configStr));
  }

  static save(config: UIConfigType) {
    const configJson = JSON.stringify(config);

    localStorage.setItem(UIConfig.LocalStorageKey, configJson);
  }
}
