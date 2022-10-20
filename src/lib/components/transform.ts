import { quat } from "gl-matrix";
import type { Point } from "../point";
import { Component } from "./component";

export type TransformComponentProps = {
  position?: Point;
  rotation?: quat;
};

export class TransformComponent extends Component {
  public position: Point;
  public rotation: quat;
  constructor({ position, rotation }: TransformComponentProps) {
    super("Transform");
    this.position = position ?? {
      x: 0,
      y: 0,
      z: 0,
    };
    this.rotation = rotation ?? quat.create();
  }

  toString(): string {
    return JSON.stringify({
      name: this.name,
      uid: this.uid,
      position: this.position,
      rotation: this.rotation,
    });
  }
}
