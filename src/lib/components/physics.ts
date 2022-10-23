import { Point } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";

export type PhysicsBox2DComponentProps = {
  box2d: typeof Box2D;
  world: Box2D.b2World;
  sideLength?: number;
  position?: Point;
  // angle
  rotation?: number;
};

export class PhysicsBox2DComponent extends Component {
  public sideLength?: number;
  public world: Box2D.b2World;
  private body: Box2D.b2Body;

  constructor(parent: SceneObject, public props: PhysicsBox2DComponentProps) {
    super(parent, "Physics");

    const { world, box2d } = props;
    this.world = world;

    const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2 } = box2d;

    // in metres per second squared

    const square = new b2PolygonShape();
    square.SetAsBox(props.sideLength ?? 1 / 2, props.sideLength ?? 1 / 2);

    const zero = new b2Vec2(0, 0);

    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(zero);

    const body = this.world.CreateBody(bd);
    body.CreateFixture(square, 1);
    body.SetTransform(
      new b2Vec2(props.position?.x ?? 0, props.position?.y ?? 0),
      props.rotation ?? 0
    );
    body.SetLinearVelocity(zero);
    body.SetAwake(true);
    body.SetEnabled(true);

    this.body = body;
  }

  get transform() {
    const { p: position, q: rotation } = this.body.GetTransform();
    return {
      position,
      rotation,
    };
  }

  toString(): string {
    return JSON.stringify({
      name: this.name,
      uid: this.uid,
      ...this.transform,
    });
  }
}
