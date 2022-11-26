import { inject, injectable } from "inversify";
import { GravitationComponentFactory } from "../components/factory/gravitationComponentFactory";
import { Scene } from "../scene";

@injectable()
export class GravitationCreator {
  constructor(
    @inject(Scene) private scene: Scene,
    @inject(GravitationComponentFactory)
    private factory: GravitationComponentFactory
  ) {}

  create() {
    const obj = this.scene.create();
    const component = this.factory.createComponent(obj);
    obj.components.push(component);

    this.scene.save();
  }
}
