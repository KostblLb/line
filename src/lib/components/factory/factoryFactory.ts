import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsBoxComponentFactory } from "./physicsBoxComponentFactory";
import { ModelComponentFactory } from "./modelComponentFactory";
import { ModelComponent } from "../model";
import { PhysicsBox2DComponent } from "../physicsBox";
import { GenericComponentFactory } from "./genericComponentFactory";
import { RendererComponentFactory } from "./rendererComponentFactory";
import { RendererComponent } from "../renderer";
import { PhysicsDiskComponentFactory } from "./physicsDiskComponentFactory";
import { PhysicsDiskComponent } from "../physicsDisk";

@injectable()
export class ComponentFactoryFactory {
  constructor(
    @inject(PhysicsBoxComponentFactory)
    private physicsBox: PhysicsBoxComponentFactory,
    @inject(PhysicsDiskComponentFactory)
    private physicsDisk: PhysicsDiskComponentFactory,
    @inject(ModelComponentFactory) private model: ModelComponentFactory,
    @inject(GenericComponentFactory) private generic: GenericComponentFactory,
    @inject(RendererComponentFactory) private renderer: RendererComponentFactory
  ) {}

  getFactory(componentName: string) {
    return (
      {
        [ModelComponent.Name]: this.model,
        [PhysicsBox2DComponent.Name]: this.physicsBox,
        [RendererComponent.Name]: this.renderer,
        [PhysicsDiskComponent.Name]: this.physicsDisk,
      }[componentName] ?? this.generic
    );
  }
}
