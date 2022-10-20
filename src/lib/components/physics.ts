import { Component } from "./component";

export type PhysicsBoxComponentProps = {
  sideLength?: number;
};

export class PhysicsBoxComponent extends Component {
  public sideLength?: number;
  public world: Box2D.b2World;
  private body: Box2D.b2Body;

  constructor(public props: PhysicsBoxComponentProps) {
    super("Physics");

    this.world = window.globalResources.physicsWorld;

    // INLINE DEMO CODE PLS REMOVE ME
    const box2d = window.globalResources.box2d as typeof Box2D;

    const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } =
      box2d;

    // in metres per second squared

    const square = new b2PolygonShape();
    square.SetAsBox(props.sideLength ?? 1 / 2, props.sideLength ?? 1 / 2);

    const zero = new b2Vec2(0, 0);

    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(zero);

    const body = this.world.CreateBody(bd);
    body.CreateFixture(square, 1);
    body.SetTransform(zero, 0);
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
}
