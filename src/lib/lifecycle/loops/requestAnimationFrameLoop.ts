import "reflect-metadata";
import { injectable } from "inversify";
import { BaseLoop } from "./baseLoop";

@injectable()
export class RequestAnimationFrameLoop extends BaseLoop {
  start() {
    let handle: number;
    const loop = (prevMs: number) => {
      const nowMs = window.performance.now();
      handle = requestAnimationFrame(loop.bind(null, nowMs));
      const deltaMs = nowMs - prevMs;
      this.step(deltaMs);
    };
    loop(window.performance.now());

    return () => cancelAnimationFrame(handle);
  }
}
