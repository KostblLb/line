import { IMaterial } from "../lib/rendering/types";

export interface IDevice {
  compileMaterial(material: IMaterial): void;
  clear(): void;
  render(material: IMaterial): void;
}
