import { SceneObject } from "../sceneObject";

export abstract class Component {
  readonly uid!: string;

  constructor(
    protected parent: SceneObject,
    public readonly name: string = "Component"
  ) {}

  abstract toString(): string;

  abstract init(props: any, uid?: string): void; // needed to initialize readonly uid
}
