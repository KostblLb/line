import { uid } from "../utils";

export class Component {
  name: string = "Component";
  uid: string = uid();

  constructor(name: string) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      uid: this.uid,
    });
  }
}
