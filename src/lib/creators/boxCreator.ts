import { inject, injectable } from "inversify";
import { GenericComponentFactory } from "../components/factory/genericComponentFactory";
import { ModelComponentFactory } from "../components/factory/modelComponentFactory";
import { PhysicsBoxComponentFactory } from "../components/factory/physicsBoxComponentFactory";
import { RendererComponentFactory } from "../components/factory/rendererComponentFactory";
import { TransformComponent } from "../components/transform";
import { Point2 } from "../point";
import { BasicMaterial } from "../rendering/basicMaterial";
import { Scene } from "../scene";

@injectable()
export class BoxCreator {
  constructor(
    @inject(Scene) private scene: Scene,
    @inject(RendererComponentFactory)
    private rendererComponentFactory: RendererComponentFactory,

    @inject(PhysicsBoxComponentFactory)
    private physicsComponentFactory: PhysicsBoxComponentFactory,

    @inject(ModelComponentFactory)
    private modelComponentFactory: ModelComponentFactory,

    @inject(GenericComponentFactory)
    private genericComponentFactory: GenericComponentFactory
  ) {}
  createBox({ position, rotation }: { position: Point2; rotation: number }) {
    const obj = this.scene.create();

    const cubeModelComponent = this.modelComponentFactory.createComponent(obj, {
      modelName: "cube",
    });
    obj.components.push(cubeModelComponent);

    const physicsComponent = this.physicsComponentFactory.createComponent(obj, {
      sideLength: 1,
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

    this.scene.save();
  }
}
