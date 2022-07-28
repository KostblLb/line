import { mat4 } from "gl-matrix";
import { makeRange } from "./utils";

export type ProjectionChangedValue = mat4;

export class ProjectionSliders extends HTMLElement {
  static ATTR_FOV = "fov";
  static ATTR_ASPECT = "aspect";
  static ATTR_NEAR = "near";
  static ATTR_FAR = "far";

  static EVENT_PROJECTION_CHANGED = "projectionChanged";

  static toString() {
    return "p-projection-sliders";
  }

  static observedAttributes = [
    ProjectionSliders.ATTR_FOV,
    ProjectionSliders.ATTR_ASPECT,
    ProjectionSliders.ATTR_NEAR,
    ProjectionSliders.ATTR_FAR,
  ];

  constructor() {
    super();

    const root = this.attachShadow({ mode: "closed" });

    root.append(
      makeRange(
        0,
        6.28,
        0.1,
        "fov",
        (value) => this.setAttribute("fov", value),
        0.5
      ),
      makeRange(3 / 4, 4 / 3, 0.1, "aspect", (value) =>
        this.setAttribute("aspect", value)
      ),
      makeRange(
        -10,
        10,
        0.1,
        "near",
        (value) => this.setAttribute("near", value),
        -1.2
      ),
      makeRange(
        -1000,
        1000,
        1,
        "far",
        (value) => this.setAttribute("far", value),
        1000
      )
    );
  }

  connectedCallback() {}

  attributeChangedCallback() {
    const projecion = mat4.create();
    mat4.perspective(
      projecion,
      Number(this.getAttribute("fov") ?? 0.5),
      Number(this.getAttribute("aspect") ?? 1),
      Number(this.getAttribute("near") ?? -1.2),
      Number(this.getAttribute("far") ?? 1000)
    );
    const e = new CustomEvent<ProjectionChangedValue>(
      ProjectionSliders.EVENT_PROJECTION_CHANGED,
      {
        bubbles: true,
        detail: projecion,
      }
    );

    this.dispatchEvent(e);
  }
}

customElements.define(String(ProjectionSliders), ProjectionSliders);
