import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./components/factory/physicsComponentFactory";
import { ModelComponent } from "./components/model";
import { SceneObject } from "./sceneObject";
import { Point2 } from "./point";
import { ModelComponentFactory } from "./components/factory/modelComponentFactory";

@injectable()
export class Scene {
  constructor(
    @inject(PhysicsComponentFactory)
    private physicsComponentFactory: PhysicsComponentFactory,

    @inject(ModelComponentFactory)
    private modelComponentFactory: ModelComponentFactory
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
    const cubeModelComponent = this.modelComponentFactory.createComponent(obj, {
      modelName: "cube",
    });
    const physicsComponent = this.physicsComponentFactory.createComponent(obj, {
      sideLength: 10,
    });

    obj.components.push(cubeModelComponent);
    obj.components.push(physicsComponent);

    this.save();
  }
}
