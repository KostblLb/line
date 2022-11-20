import cube from "./cube.json";
import sphere from "./sphere.json";
import type { Model } from "./types";

export const BuiltinModels = {
  cube,
  sphere,
} as Record<string, Model>;
