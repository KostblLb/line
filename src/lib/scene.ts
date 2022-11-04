import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./components/factory/physicsComponentFactory";
import { SceneObject } from "./sceneObject";
import { Point2 } from "./point";
import { ModelComponentFactory } from "./components/factory/modelComponentFactory";
import { ComponentFactoryFactory } from "./components/factory/factoryFactory";
import { GenericComponentFactory } from "./components/factory/genericComponentFactory";
import { TransformComponent } from "./components/transform";
import { RendererComponentFactory } from "./components/factory/rendererComponentFactory";
import { BasicMaterial } from "./rendering/basicMaterial";

@injectable()
export class Scene {
  constructor(
    @inject(PhysicsComponentFactory)
    private physicsComponentFactory: PhysicsComponentFactory,

    @inject(ModelComponentFactory)
    private modelComponentFactory: ModelComponentFactory,

    @inject(GenericComponentFactory)
    private genericComponentFactory: GenericComponentFactory,

    @inject(ComponentFactoryFactory)
    private componentFactoryFactory: ComponentFactoryFactory,

    @inject(RendererComponentFactory)
    private rendererComponentFactory: RendererComponentFactory
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

  createBox2D({ position, rotation }: { position: Point2; rotation: number }) {
    const obj = this.create();

    const cubeModelComponent = this.modelComponentFactory.createComponent(obj, {
      modelName: "cube",
    });
    obj.components.push(cubeModelComponent);

    const physicsComponent = this.physicsComponentFactory.createComponent(obj, {
      sideLength: 10,
      position,
      rotation,
    });
    obj.components.push(physicsComponent);

    const transformComponent = this.genericComponentFactory.createComponent(
      obj,
      TransformComponent,
      {
        position,
        rotation,
      }
    );
    obj.components.push(transformComponent);

    const rendererComponent = this.rendererComponentFactory.createComponent(
      obj,
      {
        material: new BasicMaterial(obj),
      }
    );
    obj.components.push(rendererComponent);

    this.save();
  }
}
