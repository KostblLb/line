import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsBox2DComponent, PhysicsBox2DComponentProps } from "../physics";
import { SceneObject } from "../../sceneObject";

@injectable()
export class PhysicsComponentFactory {
  constructor(
    @inject("Box2D.b2World") private world: Box2D.b2World,
    @inject("Box2D") private box2d: typeof Box2D
  ) {}

  createComponent(
    parent: SceneObject,
    props: Omit<PhysicsBox2DComponentProps, "box2d" | "world">
  ) {
    const comp = new PhysicsBox2DComponent(parent);

    comp.init({
      ...props,
      world: this.world,
      box2d: this.box2d,
    });

    return comp;
  }

  createComponentFromString(parent: SceneObject, str: string) {
    const { sideLength, position, rotation, uid } = JSON.parse(str);

    const comp = new PhysicsBox2DComponent(parent);
    comp.init(
      {
        position,
        rotation,
        sideLength: Number(sideLength),
        world: this.world,
        box2d: this.box2d,
      },
      uid
    );

    return comp;
  }
}
