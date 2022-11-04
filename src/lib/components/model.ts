import { Point } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";
import { BuiltinModels } from "../../models/builtins";
import type { Model } from "../../models/types";

export type ModelComponentProps = {
  modelName: string;
  offset?: Point;
};

export class ModelComponent extends Component {
  static Name = "Model";

  public readonly data!: Model;
  public readonly modelName!: string;
  public offset!: Point;

  constructor(parent: SceneObject) {
    super(parent, ModelComponent.Name);
  }

  init(props: ModelComponentProps, uid?: string) {
    Reflect.set(this, "uid", uid ?? utils.uid());
    Reflect.set(this, "modelName", props.modelName);
    Reflect.set(this, "data", BuiltinModels[props.modelName]);

    this.offset = props.offset ?? { x: 0, y: 0, z: 0 };
  }

  toJSON() {
    return {
      uid: this.uid,
      name: this.name,
      modelName: this.modelName,
      data: BuiltinModels[this.modelName]
        ? BuiltinModels[this.modelName]
        : this.data,
      offset: this.offset,
    };
  }
}
