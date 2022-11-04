import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Scene } from "../scene";
import { RendererComponent } from "../components/renderer";
import { IDevice } from "../../ui/canvas/device";

@injectable()
export class SceneRendererLifecycle implements ILifecycle {
  private devices: IDevice[] = [];
  constructor(@inject(Scene) private scene: Scene) {}

  addDevice(dev: IDevice) {
    console.info("Adding device", dev);

    for (const obj of this.scene.objects) {
      const renderer = obj.findComponentByClass(RendererComponent);
      if (renderer) {
        dev.compileMaterial(renderer.material);
      }
    }

    this.devices.push(dev);
  }

  step(deltaMs: number) {
    for (const dev of this.devices) {
      dev.clear();

      for (const obj of this.scene.objects) {
        const renderer = obj.findComponentByClass(RendererComponent);
        if (renderer?.material) {
          dev.render(renderer.material);
        }
      }
    }
  }
}
