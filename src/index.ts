//import "webgl-lint"; // will crash if you import it

import { App } from "./app";
import container from "./config/di";
import { RequestAnimationFrameLoop } from "./lib/lifecycle/loops/requestAnimationFrameLoop";
import { PhysicsLifecycle } from "./lib/lifecycle/physics";

(async () => {
  const app = await container.getAsync(App);
  document.body.appendChild(app);

  const rafLoop = await container.getAsync(RequestAnimationFrameLoop);
  const physLifecycle = await container.getAsync(PhysicsLifecycle);

  rafLoop.add(physLifecycle);

  rafLoop.start();
})();
