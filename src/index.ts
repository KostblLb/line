import "webgl-lint";
import Box2DFactory from "box2d-wasm";

import { App } from "./app";
import { configureGlobalResources } from "./config";

configureGlobalResources({
  box2d: () =>
    Box2DFactory({
      locateFile(url, scriptDir) {
        return "assets/" + url;
      },
    }).then(() => console.log("loaded box2d")),
});

console.log(App); // prevent tree shaking
