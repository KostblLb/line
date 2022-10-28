import Box2DFactory from "box2d-wasm";
import { Container } from "inversify";
import "reflect-metadata";
import { App } from "../app";
import { RequestAnimationFrameLoop } from "../lib/lifecycle/loops/requestAnimationFrameLoop";
import { PhysicsLifecycle } from "../lib/lifecycle/physics";

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
});

container
  .bind<typeof Box2D>("Box2D")
  .toDynamicValue(() =>
    Box2DFactory({
      locateFile(url) {
        return "assets/" + url;
      },
    })
  )
  .inSingletonScope();

container
  .bind<Box2D.b2World>("Box2D.b2World")
  .toDynamicValue(async (context) =>
    context.container.getAsync<typeof Box2D>("Box2D").then((box2d) => {
      return new box2d.b2World(new box2d.b2Vec2(0, 10));
    })
  )
  .inSingletonScope();

container.bind(RequestAnimationFrameLoop).toSelf();
container.bind(PhysicsLifecycle).toSelf();

container.bind<App>(App).toSelf();

export default container;
