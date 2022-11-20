import { Point2 } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";
import { ITransformSource } from "./types";

export type PhysicsDiskComponentProps = {
  box2d: typeof Box2D;
  world: Box2D.b2World;
  radius?: number;
  position?: Point2;
  // angle
  rotation?: number;
};

export class PhysicsDiskComponent
  extends Component
  implements ITransformSource
{
  static Name = "PhysicsDisk";

  public radius?: number;
  private world!: Box2D.b2World;
  private body!: Box2D.b2Body;

  constructor(parent: SceneObject) {
    super(parent, PhysicsDiskComponent.Name);
  }

  init(props: PhysicsDiskComponentProps, uid?: string) {
    Reflect.set(this, "uid", uid ?? utils.uid());

    const { world, box2d, radius } = props;

    const { b2BodyDef, b2_dynamicBody, b2Vec2, b2CircleShape } = box2d;

    const circle = new b2CircleShape();
    circle.set_m_radius(radius ?? 0.5);

    const zero = new b2Vec2(0, 0);

    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(zero);

    const body = world.CreateBody(bd);
    body.CreateFixture(circle, 1);
    body.SetTransform(
      new b2Vec2(props.position?.x ?? 0, props.position?.y ?? 0),
      props.rotation ?? 0
    );
    body.SetLinearVelocity(zero);
    body.SetAwake(true);

    body.SetGravityScale(0);
    body.SetEnabled(true);
    body.SetAngularVelocity(1);
    body.SetAngularDamping(0);

    this.world = world;
    this.body = body;
    this.radius = props.radius;
  }

  get transform() {
    const { p: position, q: rotation } = this.body.GetTransform();
    return {
      position: { x: position.x, y: position.y, z: 0 },
      rotation: rotation.GetAngle(),
    };
  }

  toJSON() {
    return {
      name: this.name,
      uid: this.uid,
      radius: this.radius,
      ...this.transform,
    };
  }
}
