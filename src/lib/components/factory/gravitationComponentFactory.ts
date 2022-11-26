import { inject, injectable } from "inversify";
import { SceneObject } from "../../sceneObject";
import { GravitationComponent } from "../gravitation";

@injectable()
export class GravitationComponentFactory {
  constructor(
    @inject("Box2D.b2World") private world: Box2D.b2World,
    @inject("Box2D") private box2d: typeof Box2D
  ) {}

  createComponent(parent: SceneObject) {
    const comp = new GravitationComponent(parent);
    comp.init({ world: this.world, box2d: this.box2d });
    return comp;
  }

  createComponentFromJSON(parent: SceneObject, json: any) {
    const comp = new GravitationComponent(parent);
    comp.init({ world: this.world, box2d: this.box2d }, json.uid);
    return comp;
  }
}
