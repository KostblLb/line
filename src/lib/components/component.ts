import { SceneObject } from "../sceneObject";
import { uid } from "../utils";

export class Component {
  readonly uid: string = uid();

  constructor(
    protected parent: SceneObject,
    public readonly name: string = "Component"
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      uid: this.uid,
    });
  }
}
