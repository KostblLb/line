import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Scene } from "../scene";
import { isStepper } from "../components/types";

@injectable()
export class PhysicsLifecycle implements ILifecycle {
  constructor(
    @inject("Box2D.b2World") private world: Box2D.b2World,
    @inject(Scene) private scene: Scene
  ) {}

  step(deltaMs: number) {
    for (const obj of this.scene.objects) {
      for (const comp of obj.components) {
        if (isStepper(comp)) {
          comp.step(deltaMs);
        }
      }
    }

    this.world.Step(deltaMs / 1000, 1, 1);
  }
}
