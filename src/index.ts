//import "webgl-lint"; // will crash if you import it
import Box2DFactory from "box2d-wasm";

import { App } from "./app";
import { configureGlobalResources } from "./config";
import { startLoop } from "./lib/lifecycle/physics";

(async () => {
  await configureGlobalResources([
    {
      box2d: () =>
        Box2DFactory({
          locateFile(url) {
            return "assets/" + url;
          },
        }),
    },
    {
      physicsWorld: () => {
        const { b2World, b2Vec2 } = window.globalResources.box2d;
        const gravity = new b2Vec2(0, 10);
        return new b2World(gravity);
      },
    },
  ]);

  console.log(App); // prevent tree shaking

  startLoop();
})();
