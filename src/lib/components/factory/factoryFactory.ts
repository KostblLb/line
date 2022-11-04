import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./physicsComponentFactory";
import { ModelComponentFactory } from "./modelComponentFactory";
import { ModelComponent } from "../model";
import { PhysicsBox2DComponent } from "../physics";
import { GenericComponentFactory } from "./genericComponentFactory";
import { RendererComponentFactory } from "./rendererComponentFactory";
import { RendererComponent } from "../renderer";

@injectable()
export class ComponentFactoryFactory {
  constructor(
    @inject(PhysicsComponentFactory) private physics: PhysicsComponentFactory,
    @inject(ModelComponentFactory) private model: ModelComponentFactory,
    @inject(GenericComponentFactory) private generic: GenericComponentFactory,
    @inject(RendererComponentFactory) private renderer: RendererComponentFactory
  ) {}

  getFactory(componentName: string) {
    return (
      {
        [ModelComponent.Name]: this.model,
        [PhysicsBox2DComponent.Name]: this.physics,
        [RendererComponent.Name]: this.renderer,
      }[componentName] ?? this.generic
    );
  }
}
