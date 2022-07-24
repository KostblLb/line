import { Point } from "./point";

export type SceneObject = {
  id: string;
  offset: Point;
};

export class Scene {
  objects: SceneObject[] = [];
}
