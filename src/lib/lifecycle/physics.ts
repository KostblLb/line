// calculate no more than a 60th of a second during one world.Step() call
const maxTimeStepMs = (1 / 60) * 1000;
const velocityIterations = 1;
const positionIterations = 1;

/**
 * Advances the world's physics by the requested number of milliseconds
 */
const step = (deltaMs: number) => {
  const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
  window.globalResources.physicsWorld.Step(
    clampedDeltaMs / 1000,
    velocityIterations,
    positionIterations
  );
};

export const startLoop = () => {
  /** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
  let handle: number;
  (function loop(prevMs) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(loop.bind(null, nowMs));
    const deltaMs = nowMs - prevMs;
    step(deltaMs);
  })(window.performance.now());

  return () => cancelAnimationFrame(handle);
};
