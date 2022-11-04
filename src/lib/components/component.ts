import { SceneObject } from "../sceneObject";
import * as utils from "../utils";

export abstract class Component {
  readonly uid!: string;

  constructor(
    public readonly parent: SceneObject,
    public readonly name: string
  ) {}

  // JSON serialization to plain objects
  abstract toJSON(): Object;

  abstract init(props: any, uid?: string): void; // needed to initialize readonly uid

  // debug serialization
  toString(): string {
    return JSON.stringify(this, null, "\t");
  }
}
