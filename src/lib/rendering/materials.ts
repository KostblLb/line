import { BasicMaterial } from "./basicMaterial";
import type { IMaterial } from "./types";

// to keep serialization simple
export const Materials: Record<string, new (...args: any) => IMaterial> = {
  BasicMaterial,
};
