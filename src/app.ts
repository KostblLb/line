import "reflect-metadata";
import { mat4, vec3 } from "gl-matrix";
import { inject, injectable } from "inversify";
import { Scene } from "./lib/scene";
import { Model } from "./models/types";
import { Canvas } from "./ui/canvas";
import { UIConfig } from "./ui/config";
import {
  CameraSliders,
  CameraSlidersChangedValue,
} from "./ui/controls/cameraSliders";
import { Mat4Control } from "./ui/controls/mat4Control";
import { ObjectGallery } from "./ui/controls/objectGallery";
import { SceneRendererLifecycle } from "./lib/lifecycle/sceneRenderer";

console.log(Canvas);

@injectable()
export class App extends HTMLElement {
  static toString() {
    return "p-app";
  }

  constructor(
    @inject(Scene) private scene: Scene,
    @inject(SceneRendererLifecycle)
    private sceneRenderer: SceneRendererLifecycle
  ) {
    super();

    const config = UIConfig.load();

    this.attachShadow({ mode: "open" });

    const canvas = document.createElement("p-canvas");

    const div = document.createElement("div");
    const cameraSliders = document.createElement(String(CameraSliders));

    const gallery = document.createElement(String(ObjectGallery));
    gallery.addEventListener(ObjectGallery.SELECT_OBJECT_EVENT, ((
      event: CustomEvent<Model>
    ) => {
      if (event.detail.name === "cube") {
        this.scene.createBox2D({
          position: {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5,
          },
          rotation: 1,
        });
      }
    }) as EventListener);

    div.append(cameraSliders, gallery);
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
  }

  connectedCallback() {
    this.initScene();
  }

  initScene() {
    this.scene.load();

    const config = UIConfig.load();

    const canvas = this.shadowRoot?.querySelector("p-canvas") as Canvas;
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
      canvas.waitUntilConnected(() => {
        canvas.setCamera(cameraMat);
        this.sceneRenderer.addDevice(canvas);
      });
    }
  }
}

customElements.define(App.toString(), App);
