import { Component } from "./components/component";
import { uid } from "./utils";

export class SceneObject {
  readonly uid: string = uid();
  components: Component[] = [];

  constructor() {}

  init(uid: string) {
    Reflect.set(this, "uid", uid);
  }

  findComponent(predicate: (component: Component) => boolean) {
    return this.components.find((c) => predicate(c));
  }

  findComponentByUid(uid: string) {
    return this.components.find((comp) => comp.uid === uid);
  }

  findComponentByName(name: string) {
    return this.components.find((comp) => comp.name === name);
  }

  findComponentByClass<T extends Component>(
    klass: new (...args: any[]) => T
  ): T | undefined {
    return this.components.find((comp) => comp instanceof klass) as T;
  }

  toString() {
    return JSON.stringify({
      uid: this.uid,
      components: Array.from(this.components.entries()).map(([idx, comp]) => ({
        uid: comp.uid,
        name: comp.name,
      })),
    });
  }

  toJSON() {
    return {
      uid: this.uid,
      components: this.components,
    };
  }
}
