import { Component } from "./components/component";
import { uid } from "./utils";

export class SceneObject {
  id: string = uid();
  components: Component[] = [];

  toString() {
    return JSON.stringify({
      id: this.id,
      components: Array.from(this.components.entries()).map(([comp]) =>
        comp.toString()
      ),
    });
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
}
