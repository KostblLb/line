import "reflect-metadata";
import { inject, injectable } from "inversify";

@injectable()
export class PhysicsLifecycle implements ILifecycle {
  constructor(@inject("Box2D.b2World") private world: Box2D.b2World) {}

  step(deltaMs: number) {
    this.world.Step(deltaMs / 1000, 1, 1);
  }
}
