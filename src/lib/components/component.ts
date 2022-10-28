import { SceneObject } from "../sceneObject";

export abstract class Component {
  readonly uid!: string;

  constructor(
    protected parent: SceneObject,
    public readonly name: string = "Component"
  ) {}

  // JSON serialization to plain objects
  abstract toJSON(): Object;

  abstract init(props: any, uid?: string): void; // needed to initialize readonly uid

  // debug serialization
  toString(): string {
    return JSON.stringify(this, null, "\t");
  }
}
