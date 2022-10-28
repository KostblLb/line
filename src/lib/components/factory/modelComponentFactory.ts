import "reflect-metadata";
import { injectable } from "inversify";
import { Point } from "../../point";
import { SceneObject } from "../../sceneObject";
import { ModelComponent } from "../model";

@injectable()
export class ModelComponentFactory {
  constructor() {}

  createComponent(
    parent: SceneObject,
    { modelName, offset }: { modelName: string; offset?: Point }
  ) {
    const comp = new ModelComponent(parent);
    comp.init({ modelName, offset });
    return comp;
  }

  createComponentFromJSON(parent: SceneObject, json: any) {
    const { offset, modelName, uid } = json;
    const comp = new ModelComponent(parent);

    comp.init(
      {
        modelName,
        offset,
      },
      uid
    );

    return comp;
  }
}
