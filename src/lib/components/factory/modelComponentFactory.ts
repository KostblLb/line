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

  createComponentFromString(parent: SceneObject, str: string) {
    const { offset, modelName, uid } = JSON.parse(str);
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
