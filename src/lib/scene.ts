import { Point } from "./point";
import { uid } from "./utils";

export type SceneObject = {
  id: string;
  model: string;
  offset: Point;
};

export class Scene {
  objects: SceneObject[] = [];

  add(model: string, offset: Point) {
    const id = uid();
    this.objects.push({
      id,
      model,
      offset,
    });

    this.save();

    return id;
  }

  save() {
    localStorage.setItem("scene", JSON.stringify(this.objects));
  }

  load() {
    this.objects = JSON.parse(localStorage.getItem("scene") ?? "[]");
  }
}
