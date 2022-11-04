import "reflect-metadata";
import { injectable } from "inversify";
import { SceneObject } from "../../sceneObject";
import { RendererComponent, RendererComponentProps } from "../renderer";
import { Materials } from "../../rendering/materials";

@injectable()
export class RendererComponentFactory {
  createComponent(parent: SceneObject, props: RendererComponentProps) {
    const comp = new RendererComponent(parent);

    comp.init(props);

    return comp;
  }

  createComponentFromJSON(parent: SceneObject, json: any) {
    const { uid, material: materialName } = json;

    const Material = Materials[materialName];

    if (!Material) {
      throw new Error(`No material with name "${materialName}"`);
    }

    const comp = new RendererComponent(parent);
    comp.init(
      {
        material: new Material(parent), // ???
      },
      uid
    );

    return comp;
  }
}
