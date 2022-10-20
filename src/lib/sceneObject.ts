import { Component } from "./components/component";
import { uid } from "./utils";

export class SceneObject {
  id: string = uid();
  components: Set<Component> = new Set();

  toString() {
    return JSON.stringify({
      id: this.id,
      components: Array.from(this.components.entries()).map(([comp]) =>
        comp.toString()
      ),
    });
  }
}
