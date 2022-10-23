import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./components/factory/physicsComponentFactory";
import { ModelComponent } from "./components/model";
import { SceneObject } from "./sceneObject";
import { Point, Point2 } from "./point";
import { quat } from "gl-matrix";

@injectable()
export class Scene {
  constructor(
    @inject(PhysicsComponentFactory)
    private physicsComponentFactory: PhysicsComponentFactory
  ) {}

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

  createBox2D({ position, rotation }: { position: Point2; rotation: number }) {
    const obj = this.create();
    const cubeModelComponent = new ModelComponent(obj, {
      modelName: "cube",
    });
    const physicsComponent = this.physicsComponentFactory.createComponent(obj);

    obj.components.push(cubeModelComponent);
    obj.components.push(physicsComponent);

    this.save();
  }
}
