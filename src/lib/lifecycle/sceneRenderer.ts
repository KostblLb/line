import "reflect-metadata";
import { injectable } from "inversify";
import { Scene } from "../scene";
import { RendererComponent } from "../components/renderer";
import { Program } from "../../ui/canvas/utils";

@injectable()
export class SceneRendererLifecycle implements ILifecycle {
  private devices: WebGL2RenderingContext[] = [];
  private compiledShaders = new Map<
    WebGL2RenderingContext,
    Map<string, Program<any, any>>
  >();
  constructor(private scene: Scene) {}

  addDevice(gl: WebGL2RenderingContext) {
    if (!this.compiledShaders.has(gl)) {
      this.compiledShaders.set(gl, new Map());
    }
    const deviceShaders = this.compiledShaders.get(gl)!;

    this.scene.objects.forEach((obj) => {
      const renderer = obj.findComponentByClass(RendererComponent);
      if (renderer) {
        const matName = Object.getPrototypeOf(renderer.material).constructor
          .name; /// ???
        const compiled = deviceShaders.has(matName);
        if (!compiled) {
          return;
        }
        const prog = renderer.material.addDevice(gl);
        deviceShaders.set(matName, prog);
      }
    });
  }

  step(deltaMs: number) {
    this.devices.forEach((dev) => {
      this.scene.objects.forEach((obj) => {
        const renderer = obj.findComponentByClass(RendererComponent);
        if (renderer?.material) {
          const matName = Object.getPrototypeOf(renderer.material).constructor
            .name; /// ???

          let shader = this.compiledShaders.get(dev)?.get(matName);
          if (!shader) {
            if (!this.compiledShaders.has(dev)) {
              this.compiledShaders.set(dev, new Map());
            }
            shader = renderer.material.addDevice(dev);
            this.compiledShaders.get(dev)?.set(matName, shader);
          }
        }
      });
    });
  }
}
