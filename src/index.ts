//import "webgl-lint"; // will crash if you import it

import { App } from "./app";
import { startLoop } from "./lib/lifecycle/physics";
import container from "./config/di";

(async () => {
  const app = await container.getAsync(App);
  document.body.appendChild(app);

  startLoop();
})();
