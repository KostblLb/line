import "reflect-metadata";
import { PhysicsComponentFactory } from "src/lib/components/factory/physicsComponentFactory";
import { SceneObject } from "src/lib/sceneObject";
import { createMockContainer } from "tests/container";

jest.mock("src/lib/utils", () => ({
  uid: jest.fn().mockReturnValue("u-i-d"),
}));

describe("PhysicsComponentFactory", () => {
  const container = createMockContainer();
  const so = new SceneObject();
  const factory = container.get(PhysicsComponentFactory);

  it("creates component from scratch", () => {
    const comp = factory.createComponent(so, {
      position: { x: 1, y: 2 },
      rotation: 90,
      sideLength: 10,
    });

    expect(comp.uid).toBe("u-i-d");
    expect(comp.sideLength).toBe(10);
    expect(comp.transform).toStrictEqual({
      position: { x: 1, y: 2 },
      rotation: 90,
    });
  });

  it("creates component from string", () => {
    const serialized = JSON.stringify({
      uid: "test",
      position: { x: 1, y: 2 },
      rotation: 90,
      sideLength: 10,
    });
    const comp = factory.createComponentFromString(so, serialized);

    expect(comp.uid).toBe("test");
    expect(comp.sideLength).toBe(10);
    expect(comp.transform).toStrictEqual({
      position: { x: 1, y: 2 },
      rotation: 90,
    });
  });
});
