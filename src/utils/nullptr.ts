export const isNullptr = (box2d: typeof Box2D, box2dEntity: any) =>
  box2d.getPointer(box2dEntity) === box2d.getPointer(box2d.NULL);
