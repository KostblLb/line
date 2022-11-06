import { quat } from "gl-matrix";
import { Point } from "../point";
import { SceneObject } from "../sceneObject";
import { Component } from "./component";
import { PhysicsBox2DComponent } from "./physics";
import * as utils from "../utils";

export type TransformComponentProps = {
  position?: Point;
  rotation?: quat;
};

export class TransformComponent extends Component {
  static Name = "Transform";

  private physics?: PhysicsBox2DComponent;
  private _position: Point = { x: 0, y: 0, z: 0 };
  private _rotation: quat = quat.create();

  constructor(parent: SceneObject) {
    super(parent, TransformComponent.Name);
  }

  init(props: TransformComponentProps, uid?: string) {
    Reflect.set(this, "uid", uid ?? utils.uid());
    this.physics = this.parent.findComponentByClass(PhysicsBox2DComponent);
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
    const physicsTransform = this.physics?.transform;
    if (physicsTransform) {
      return { ...physicsTransform.position, z: 0 }; // fix for 3d physics
    }
    return this._position;
  }

  get rotation() {
    const physicsTransform = this.physics?.transform;
    if (physicsTransform) {
      const rot = quat.create();
      quat.fromEuler(rot, 0, 0, (physicsTransform.rotation / Math.PI) * 180);
      return rot;
    }
    return this._rotation;
  }
}
