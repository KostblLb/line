import { TransformComponentProps } from "./components/transform";
import { SceneObject } from "./sceneObject";

export class Scene {
  objects: SceneObject[] = [];

  create() {
    const object = new SceneObject();
    this.objects.push(object);

    this.save();

    return object;
  }

  save() {
    localStorage.setItem("scene", JSON.stringify(this.objects));
  }

  load() {
    this.objects = JSON.parse(localStorage.getItem("scene") ?? "[]");
  }

  createBox(transformProps: TransformComponentProps) {}
}
