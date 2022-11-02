import "reflect-metadata";
import { injectable } from "inversify";
import { SceneObject } from "../../sceneObject";
import { Component } from "../component";

// all generally created components go here ???
import { TransformComponent } from "../transform";

const GenericComponents: Record<
  string,
  new (parent: SceneObject) => Component
> = [TransformComponent].reduce(
  (acc, cur) => ({
    ...acc,
    [cur.Name]: cur,
  }),
  {}
);

@injectable()
export class GenericComponentFactory {
  constructor() {}

  createComponent(
    parent: SceneObject,
    Klass: new (parent: SceneObject) => Component,
    props: any
  ) {
    const comp = new Klass(parent);
    comp.init(props);
    return comp;
  }

  createComponentFromJSON(parent: SceneObject, json: any) {
    const { uid, name, ...props } = json;

    const Klass = GenericComponents[name];
    const comp = new Klass(parent);

    comp.init(props, uid);

    return comp;
  }
}
