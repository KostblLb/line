import { quat } from "gl-matrix";
import { Point } from "../point";

// A sibling Component that implements ITransformSource will be used internally by TransformComponent to determine position and rotation
export interface ITransformSource {
  get transform(): { position: Point; rotation: number | quat };
}

export const isTransformSource = (
  component: any
): component is ITransformSource => {
  return (
    typeof component.transform === "object" ||
    typeof component.transform === "function"
  );
};
