import { Point } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";

export type ModelComponentProps = {
  modelName: string;
  offset?: Point;
};

export class ModelComponent extends Component {
  static Name = "Model";

  public readonly modelName: string;
  public offset: Point;
  /**
   *
   */
  constructor(parent: SceneObject, public props: ModelComponentProps) {
    super(parent, ModelComponent.Name);
    this.modelName = props.modelName;
    this.offset = props.offset ?? { x: 0, y: 0, z: 0 };
  }
}
