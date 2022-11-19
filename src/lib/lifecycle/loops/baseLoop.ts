import { errorBoundary } from "../../../utils/errorBoundary";

export class BaseLoop {
  private lifecycles: ILifecycle[] = [];

  add(lifecycle: ILifecycle) {
    const idx = this.lifecycles.indexOf(lifecycle);
    if (idx < 0) {
      this.lifecycles.push(lifecycle);
    }
  }

  remove(lifecycle: ILifecycle) {
    const idx = this.lifecycles.indexOf(lifecycle);
    if (idx >= 0) {
      this.lifecycles.splice(idx, 1);
    }
  }

  start() {
    return function stop() {};
  }

  step(deltaMs: number) {
    this.lifecycles.forEach(errorBoundary((lc) => lc.step(deltaMs)));
  }
}
