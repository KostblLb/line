import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  PhysicsDiskComponentProps,
  PhysicsDiskComponent,
} from "../physicsDisk";
import { SceneObject } from "../../sceneObject";

@injectable()
export class PhysicsDiskComponentFactory {
  constructor(
    @inject("Box2D.b2World") private world: Box2D.b2World,
    @inject("Box2D") private box2d: typeof Box2D
  ) {}

  createComponent(
    parent: SceneObject,
    props: Omit<PhysicsDiskComponentProps, "box2d" | "world">
  ) {
    const comp = new PhysicsDiskComponent(parent);

    comp.init({
      ...props,
      world: this.world,
      box2d: this.box2d,
    });

    return comp;
  }

  createComponentFromJSON(parent: SceneObject, json: any) {
    const { radius, position, rotation, uid } = json;

    const comp = new PhysicsDiskComponent(parent);
    comp.init(
      {
        position,
        rotation,
        radius: Number(radius),
        world: this.world,
        box2d: this.box2d,
      },
      uid
    );

    return comp;
  }
}
