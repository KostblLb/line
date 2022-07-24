export type CameraSlidersChangedEventValue = {
  x: string;
  y: string;
  z: string;
};

export class CameraSliders extends HTMLElement {
  static ATTR_ROT_X = "rotx";
  static ATTR_ROT_Y = "roty";
  static ATTR_ROT_Z = "rotz";

  static EVENT_CAMERA_CHANGED = "cameraChanged";

  static toString() {
    return "p-camera-sliders";
  }

  static observedAttributes = [
    CameraSliders.ATTR_ROT_X,
    CameraSliders.ATTR_ROT_Y,
    CameraSliders.ATTR_ROT_Z,
  ];

  constructor() {
    super();

    const root = this.attachShadow({ mode: "closed" });

    for (const attr of [
      CameraSliders.ATTR_ROT_X,
      CameraSliders.ATTR_ROT_Y,
      CameraSliders.ATTR_ROT_Z,
    ]) {
      const input = document.createElement("input");
      input.type = "range";
      input.max = String(Math.PI * 2);
      input.min = String(-Math.PI * 2);
      input.step = String(0.01);
      input.oninput = () => this.setAttribute(attr, input.value);

      const label = document.createElement("label");
      label.append(attr, input);

      root.append(label);
    }
  }

  attributeChangedCallback() {
    const e = new CustomEvent<CameraSlidersChangedEventValue>(
      CameraSliders.EVENT_CAMERA_CHANGED,
      {
        bubbles: true,
        detail: {
          x: this.getAttribute(CameraSliders.ATTR_ROT_X) ?? "0",
          y: this.getAttribute(CameraSliders.ATTR_ROT_Y) ?? "0",
          z: this.getAttribute(CameraSliders.ATTR_ROT_Z) ?? "0",
        },
      }
    );

    this.dispatchEvent(e);
  }
}

customElements.define(String(CameraSliders), CameraSliders);
