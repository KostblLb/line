import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SceneObject } from "./sceneObject";
import { ComponentFactoryFactory } from "./components/factory/factoryFactory";

@injectable()
export class Scene {
  constructor(
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

  toJSON() {
    return {
      objects: this.objects,
    };
  }

  save() {
    localStorage.setItem("scene", JSON.stringify(this));
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
        this.objects.push(object);
      });
    }
  }
}
