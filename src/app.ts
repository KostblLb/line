import { mat4, vec3 } from "gl-matrix";
import { Scene } from "./lib/scene";
import { Canvas } from "./ui/canvas";
import { UIConfig } from "./ui/config";
import {
  CameraSliders,
  CameraSlidersChangedValue,
} from "./ui/controls/cameraSliders";
import { Mat4Control } from "./ui/controls/mat4Control";
import {
  ProjectionChangedValue,
  ProjectionSliders,
} from "./ui/controls/projectionSliders";

console.log(Canvas);

export class App extends HTMLElement {
  scene!: Scene;

  constructor() {
    super();

    const config = UIConfig.load();

    this.attachShadow({ mode: "open" });

    const canvas = document.createElement("p-canvas");

    const div = document.createElement("div");
    const cameraSliders = document.createElement(String(CameraSliders));

    const projectionSliders = document.createElement(String(ProjectionSliders));
    projectionSliders.style.display = "none";

    const mat4Control = document.createElement(String(Mat4Control));
    mat4Control.addEventListener("yolo-input", (event) =>
      (canvas as Canvas).setCamera((event as CustomEvent).detail as mat4)
    );

    const selectedId = document.createElement("span");
    canvas.addEventListener(Canvas.OBJECT_CLICKED_EVENT, ((
      event: CustomEvent<number>
    ) => {
      console.log(event);
      selectedId.textContent = String(event.detail);
    }) as EventListener);

    div.append(cameraSliders, projectionSliders, mat4Control, selectedId);
    div.style.position = "absolute";

    this.shadowRoot?.append(div, canvas);

    cameraSliders.addEventListener(CameraSliders.EVENT_CAMERA_CHANGED, ((
      event: CustomEvent<CameraSlidersChangedValue>
    ) => {
      const rot = mat4.create();
      const { rotx, roty, rotz, offset } = event.detail;
      mat4.rotateX(rot, rot, rotx);
      mat4.rotateY(rot, rot, roty);
      mat4.rotateZ(rot, rot, rotz);
      mat4.translate(rot, rot, vec3.fromValues(0, 0, Number(offset ?? 0)));

      (canvas as Canvas).setCamera(rot);

      UIConfig.save({
        camera: event.detail,
      });
    }) as EventListener);

    // projectionSliders.addEventListener(
    //   ProjectionSliders.EVENT_PROJECTION_CHANGED,
    //   ((event: CustomEvent<ProjectionChangedValue>) => {
    //     (canvas as Canvas).setProjection(event.detail);
    //   }) as EventListener
    // );

    this.scene = new Scene();
  }

  connectedCallback() {
    this.initScene();
  }

  initScene() {
    const scene = this.getScene();
    this.scene = scene;

    const config = UIConfig.load();

    const canvas = this.shadowRoot?.querySelector("p-canvas") as Canvas;
    canvas.waitUntilConnected(() => canvas.setScene(this.scene));

    if (config) {
      (
        this.shadowRoot?.querySelector(String(CameraSliders)) as CameraSliders
      ).setCamera(config.camera);
      const cameraMat = mat4.create();
      mat4.rotateX(cameraMat, cameraMat, +config.camera.rotx);
      mat4.rotateY(cameraMat, cameraMat, +config.camera.roty);
      mat4.rotateZ(cameraMat, cameraMat, +config.camera.rotz);
      mat4.translate(
        cameraMat,
        cameraMat,
        vec3.fromValues(0, 0, +config.camera.offset)
      );
      console.log(cameraMat);
      canvas.waitUntilConnected(() => canvas.setCamera(cameraMat));
    }
  }

  getScene() {
    const scene = new Scene();
    scene.objects.push({
      id: "cube1",
      model: "cube",
      offset: {
        x: 0,
        y: 0,
        z: 0,
      },
    });

    scene.objects.push({
      id: "cube2",
      model: "cube",
      offset: {
        x: 1.5,
        y: 0,
        z: 0,
      },
    });

    return scene;
  }
}

customElements.define("p-app", App);
