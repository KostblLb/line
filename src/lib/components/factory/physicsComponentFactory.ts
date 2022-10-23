import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsBox2DComponent } from "../physics";
import { SceneObject } from "../../sceneObject";

@injectable()
export class PhysicsComponentFactory {
  constructor(
    @inject("Box2D.b2World") private world: Box2D.b2World,
    @inject("Box2D") private box2d: typeof Box2D
  ) {
    console.log("wowo im using this!", box2d, world);
  }

  createComponent(parent: SceneObject) {
    return new PhysicsBox2DComponent(parent, {
      sideLength: 10,
      world: this.world,
      box2d: this.box2d,
    });
  }
}
