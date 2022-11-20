import { Point2 } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";
import { ITransformSource } from "./types";

export type PhysicsBox2DComponentProps = {
  box2d: typeof Box2D;
  world: Box2D.b2World;
  sideLength?: number;
  position?: Point2;
  // angle
  rotation?: number;
};

export class PhysicsBox2DComponent
  extends Component
  implements ITransformSource
{
  static Name = "Physics";

  public sideLength?: number;
  private world!: Box2D.b2World;
  private body!: Box2D.b2Body;

  constructor(parent: SceneObject) {
    super(parent, PhysicsBox2DComponent.Name);
  }

  init(props: PhysicsBox2DComponentProps, uid?: string) {
    Reflect.set(this, "uid", uid ?? utils.uid());

    const { world, box2d } = props;

    const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2 } = box2d;

    const square = new b2PolygonShape();
    square.SetAsBox(
      (props.sideLength ?? 1) * 0.5,
      (props.sideLength ?? 1) * 0.5
    );

    const zero = new b2Vec2(0, 0);

    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(zero);

    const body = world.CreateBody(bd);
    body.CreateFixture(square, 1);
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
    this.sideLength = props.sideLength;
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
      sideLength: this.sideLength,
      ...this.transform,
    };
  }
}
