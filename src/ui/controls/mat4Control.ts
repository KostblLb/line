import { mat4 } from "gl-matrix";
export class Mat4Control extends HTMLElement {
  static observedAttributes = Array(16)
    .fill(0)
    .map((_, i) => `a${i}`);

  static toString() {
    return "p-matrix-control";
  }

  /**
   *
   */
  constructor() {
    super();

    const root = this.attachShadow({ mode: "open" });

    for (let i = 0; i < 4; i++) {
      const div = document.createElement("div");
      for (let j = 0; j < 4; j++) {
        const input = document.createElement("input");
        input.setAttribute("yolo", `a${i * 4 + j}`);
        input.oninput = () => {
          this.setAttribute(`a${i * 4 + j}`, input.value);
          this.dispatchEvent(
            new CustomEvent("yolo-input", {
              bubbles: true,
              detail: this.getMat4(),
            })
          );
        };
        div.append(input);
      }

      root.append(div);
    }
  }

  connectedCallback() {
    this.setMat4(mat4.create());
  }

  getMat4() {
    return Float32Array.from(
      Mat4Control.observedAttributes.map((attr) =>
        Number(this.getAttribute(attr) ?? 0)
      )
    );
  }

  setMat4(mat: mat4) {
    mat.forEach((a, i) => {
      (
        this.shadowRoot!.querySelector(`[yolo="a${i}"]`) as HTMLInputElement
      ).value = String(a);
      this.setAttribute(`a${i}`, String(a));
    });
  }
}

customElements.define(String(Mat4Control), Mat4Control);
