import { Component } from "./component";
import { IStepper } from "./types";
import { SceneObject } from "../sceneObject";
import * as utils from "../utils";
import { isNullptr } from "../../utils/nullptr";

const _G_ = 1;

export type GravitationComponentProps = {
  box2d: typeof Box2D;
  world: Box2D.b2World;
};

export class GravitationComponent extends Component implements IStepper {
  static Name = "GravitationComponent";

  private box2d!: typeof Box2D;
  private world!: Box2D.b2World;

  constructor(parent: SceneObject) {
    super(parent, GravitationComponent.Name);
  }

  toJSON(): Object {
    return {
      uid: this.uid,
      name: this.name,
    };
  }

  init(props: GravitationComponentProps, uid?: string | undefined): void {
    Reflect.set(this, "uid", uid ?? utils.uid());
    this.box2d = props.box2d;
    this.world = props.world;
  }

  step(deltaMs: number) {
    let body = this.world.GetBodyList();
    while (!isNullptr(this.box2d, body)) {
      let otherBody = body.GetNext();
      while (!isNullptr(this.box2d, otherBody)) {
        const bodyPos = body.GetPosition();
        const otherBodyPos = otherBody.GetPosition();
        bodyPos.op_sub(otherBodyPos);

        const r2 = bodyPos.LengthSquared();

        const F = -(_G_ * (body.GetMass() * otherBody.GetMass())) / r2;
        bodyPos.op_mul(F);

        body.ApplyForceToCenter(bodyPos, true);
        otherBody.ApplyForceToCenter(
          new this.box2d.b2Vec2(-bodyPos.x, -bodyPos.y),
          true
        );

        otherBody = otherBody.GetNext();
      }

      body = body.GetNext();
    }
  }
}
