import { quat } from "gl-matrix";
import { Point } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import * as utils from "../utils";
import { isTransformSource, ITransformSource } from "./types";

export type TransformComponentProps = {
  position?: Point;
  rotation?: quat;
};

export class TransformComponent extends Component {
  static Name = "Transform";

  private source?: ITransformSource;
  private _position: Point = { x: 0, y: 0, z: 0 };
  private _rotation: quat = quat.create();

  constructor(parent: SceneObject) {
    super(parent, TransformComponent.Name);
  }

  init(props: TransformComponentProps, uid?: string) {
    Reflect.set(this, "uid", uid ?? utils.uid());
    this.source = this.parent.findComponent(
      (c) => isTransformSource(c)

      // TODO fix type
    ) as any as ITransformSource;
    if (props.position) {
      this._position = { ...props.position };
    }
  }

  toJSON() {
    return {
      uid: this.uid,
      name: this.name,
      position: this._position,
      rotation: Array.from(this._rotation.values()),
    };
  }

  get position() {
    const sourceTransform = this.source?.transform;
    if (sourceTransform) {
      return { ...sourceTransform.position, z: 0 }; // fix for 3d physics
    }
    return this._position;
  }

  get rotation() {
    const sourceTransform = this.source?.transform;
    if (sourceTransform) {
      const rot = quat.create();
      typeof sourceTransform.rotation === "number"
        ? quat.fromEuler(rot, 0, 0, (sourceTransform.rotation / Math.PI) * 180)
        : sourceTransform.rotation;
      return rot;
    }
    return this._rotation;
  }
}
