import type { IMaterial } from "../rendering/types";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";

export type RendererComponentProps = {
  material: IMaterial;
};

export class RendererComponent extends Component {
  static Name = "RendererComponent";
  public material!: IMaterial;

  constructor(parent: SceneObject) {
    super(parent, RendererComponent.Name);
  }

  toJSON(): Object {
    return {
      name: this.name,
      uid: this.uid,
      material: Object.getPrototypeOf(this.material).constructor.name,
    };
  }

  init(props: RendererComponentProps, uid?: string | undefined): void {
    Reflect.set(this, "uid", uid ?? utils.uid());
    this.material = props.material;
  }
}
