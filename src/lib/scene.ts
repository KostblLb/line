import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./components/factory/physicsComponentFactory";
import { SceneObject } from "./sceneObject";
import { Point2 } from "./point";
import { ModelComponentFactory } from "./components/factory/modelComponentFactory";
import { ComponentFactoryFactory } from "./components/factory/factoryFactory";

@injectable()
export class Scene {
  constructor(
    @inject(PhysicsComponentFactory)
    private physicsComponentFactory: PhysicsComponentFactory,

    @inject(ModelComponentFactory)
    private modelComponentFactory: ModelComponentFactory,

    @inject(ComponentFactoryFactory)
    private componentFactoryFactory: ComponentFactoryFactory
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
    this.objects = [];
    const sceneStr = localStorage.getItem("scene");
    if (sceneStr) {
      const sceneJson = JSON.parse(sceneStr) as ISerializedScene;
      sceneJson.objects.forEach((objJson) => {
        const object = new SceneObject();
        object.init(objJson.uid);
        objJson.components.forEach((compJson) => {
          const compFactory = this.componentFactoryFactory.getFactory(
            compJson.name
          );
          const comp = compFactory.createComponentFromJSON(object, compJson);
          object.components.push(comp);
        });
      });
    }
  }

  createBox2D({ position, rotation }: { position: Point2; rotation: number }) {
    const obj = this.create();
    const cubeModelComponent = this.modelComponentFactory.createComponent(obj, {
      modelName: "cube",
    });
    const physicsComponent = this.physicsComponentFactory.createComponent(obj, {
      sideLength: 10,
      position,
      rotation,
    });

    obj.components.push(cubeModelComponent);
    obj.components.push(physicsComponent);

    this.save();
  }
}
