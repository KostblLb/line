import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PhysicsComponentFactory } from "./physicsComponentFactory";
import { ModelComponentFactory } from "./modelComponentFactory";
import { ModelComponent } from "../model";
import { PhysicsBox2DComponent } from "../physics";

@injectable()
export class ComponentFactoryFactory {
  constructor(
    @inject(PhysicsComponentFactory) private physics: PhysicsComponentFactory,
    @inject(ModelComponentFactory) private model: ModelComponentFactory
  ) {}

  getFactory(componentName: string) {
    return {
      [ModelComponent.Name]: this.model,
      [PhysicsBox2DComponent.Name]: this.physics,
    }[componentName];
  }
}
