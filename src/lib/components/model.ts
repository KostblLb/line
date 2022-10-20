import { Component } from "./component";

export type ModelComponentProps = {
  modelName: string;
};

export class ModelComponent extends Component {
  /**
   *
   */
  constructor(public props: ModelComponentProps) {
    super("Model");
  }
}
