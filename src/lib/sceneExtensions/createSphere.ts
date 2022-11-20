import { inject, injectable } from "inversify";
import { GenericComponentFactory } from "../components/factory/genericComponentFactory";
import { ModelComponentFactory } from "../components/factory/modelComponentFactory";
import { PhysicsDiskComponentFactory } from "../components/factory/physicsDiskComponentFactory";
import { RendererComponentFactory } from "../components/factory/rendererComponentFactory";
import { TransformComponent } from "../components/transform";
import { Point2 } from "../point";
import { BasicMaterial } from "../rendering/basicMaterial";
import { Scene } from "../scene";

@injectable()
export class CreateSphereSceneExtension {
  constructor(
    @inject(Scene) private scene: Scene,
    @inject(RendererComponentFactory)
    private rendererComponentFactory: RendererComponentFactory,

    @inject(PhysicsDiskComponentFactory)
    private physicsDiskComponentFactory: PhysicsDiskComponentFactory,

    @inject(ModelComponentFactory)
    private modelComponentFactory: ModelComponentFactory,

    @inject(GenericComponentFactory)
    private genericComponentFactory: GenericComponentFactory
  ) {}
  createSphere({ position, rotation }: { position: Point2; rotation: number }) {
    const obj = this.scene.create();

    const cubeModelComponent = this.modelComponentFactory.createComponent(obj, {
      modelName: "sphere",
    });
    obj.components.push(cubeModelComponent);

    const physicsComponent = this.physicsDiskComponentFactory.createComponent(
      obj,
      {
        radius: 1,
        position,
        rotation,
      }
    );
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

    this.scene.save();
  }
}
