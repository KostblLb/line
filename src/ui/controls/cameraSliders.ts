import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { CameraConfig, UIConfig } from "../config";

export type CameraSlidersChangedValue = {
  rotx: number;
  roty: number;
  rotz: number;
  offset: number;
};

export class CameraSliders extends HTMLElement {
  root!: ShadowRoot;

  static ATTR_ROT_X = "rotx" as const;
  static ATTR_ROT_Y = "roty" as const;
  static ATTR_ROT_Z = "rotz" as const;
  static ATTR_OFFSET = "offset" as const;

  static EVENT_CAMERA_CHANGED = "cameraChanged";

  static toString() {
    return "p-camera-sliders";
  }

  static observedAttributes = [
    CameraSliders.ATTR_ROT_X,
    CameraSliders.ATTR_ROT_Y,
    CameraSliders.ATTR_ROT_Z,
    CameraSliders.ATTR_OFFSET,
  ] as const;

  constructor() {
    super();

    const root = this.attachShadow({ mode: "closed" });
    this.root = root;

    for (const attr of CameraSliders.observedAttributes) {
      const input = document.createElement("input");
      input.setAttribute("data-attr", attr);
      input.type = "range";
      input.max =
        attr === CameraSliders.ATTR_OFFSET ? "10" : String(Math.PI * 2);
      input.min = CameraSliders.ATTR_OFFSET ? "-10" : String(-Math.PI * 2);
      input.step = String(0.01);
      input.oninput = () => this.inputChanged();

      const label = document.createElement("label");
      label.append(attr, input);

      root.append(label);
    }
  }

  private getInputValue(attr: string) {
    return Number(
      (this.root.querySelector(`[data-attr="${attr}"]`) as HTMLInputElement)
        .value ?? 0
    );
  }

  private setInputValue(attr: string, value: string) {
    (
      this.root.querySelector(`[data-attr="${attr}"`) as HTMLInputElement
    ).value = value;
  }

  private inputChanged() {
    const [rotx, roty, rotz, offset] = [
      this.getInputValue(CameraSliders.ATTR_ROT_X) ?? 0,
      this.getInputValue(CameraSliders.ATTR_ROT_Y) ?? 0,
      this.getInputValue(CameraSliders.ATTR_ROT_Z) ?? 0,
      this.getInputValue(CameraSliders.ATTR_OFFSET) ?? 0,
    ];
    const e = new CustomEvent<CameraSlidersChangedValue>(
      CameraSliders.EVENT_CAMERA_CHANGED,
      {
        bubbles: true,
        detail: {
          rotx,
          roty,
          rotz,
          offset,
        },
      }
    );

    this.dispatchEvent(e);
  }

  setCamera(camera: CameraConfig) {
    this.setInputValue(CameraSliders.ATTR_ROT_X, camera.rotx);
    this.setInputValue(CameraSliders.ATTR_ROT_Y, camera.roty);
    this.setInputValue(CameraSliders.ATTR_ROT_Z, camera.rotz);
    this.setInputValue(CameraSliders.ATTR_OFFSET, camera.offset);
  }
}

customElements.define(String(CameraSliders), CameraSliders);
