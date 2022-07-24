import { Scene } from "./lib/scene";
import { Canvas } from "./ui/canvas";
import { CameraSliders } from "./ui/controls/cameraSliders";
console.log(Canvas);

export class App extends HTMLElement {
  scene!: Scene;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const div = document.createElement("div");
    const sliders = document.createElement(String(CameraSliders));

    console.log("created");
    const canvas = document.createElement("p-canvas");
    div.append(sliders, canvas);
    console.log("appended");

    this.shadowRoot?.appendChild(div);

    // sliders.addEventListener(CameraSliders.EVENT_CAMERA_CHANGED, ((
    //   event: CustomEvent<CameraSlidersChangedEventValue>
    // ) => {
    //   const { x, y, z } = event.detail;
    //   canvas.setAttribute("modelviewx", x);
    //   canvas.setAttribute("modelviewy", y);
    //   canvas.setAttribute("modelviewz", z);
    // }) as EventListener);

    const anim = (timestamp: number) => {
      const sec = timestamp / 1000;
      canvas.setAttribute("modelviewx", String(0.2 + Math.sin(sec) / 10000));
      canvas.setAttribute("modelvuewx", String("0.23"));
      canvas.setAttribute("modelviewy", String(Math.cos(sec)));
      canvas.setAttribute("modelvuewz", String(1));
      //canvas.setAttribute("modelviewz", String((sec % 1000) / 1000));

      window.requestAnimationFrame(anim);
    };
    window.requestAnimationFrame(anim);

    this.scene = new Scene();
  }

  connectedCallback() {
    this.initScene();
  }

  initScene() {
    this.scene.objects.push({
      id: "cube",
      offset: {
        x: 0.4,
        y: 0.3,
        z: 0,
      },
    });

    const canvas = this.shadowRoot?.querySelector("p-canvas") as Canvas;
    console.log("setting scene");
    canvas.waitUntilConnected(() => canvas.setScene(this.scene));
  }
}

customElements.define("p-app", App);
