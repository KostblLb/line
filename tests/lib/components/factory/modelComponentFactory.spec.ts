import { ModelComponentFactory } from "src/lib/components/factory/modelComponentFactory";
import { SceneObject } from "src/lib/sceneObject";
import { createMockContainer } from "tests/container";

jest.mock("src/lib/utils", () => ({
  uid: jest.fn().mockReturnValue("u-i-d"),
}));

describe("ModelComponentFactory", () => {
  const container = createMockContainer();
  const so = new SceneObject();
  const factory = container.get(ModelComponentFactory);

  it("creates component from scratch", () => {
    const comp = factory.createComponent(so, {
      modelName: "test",
      offset: { x: 1, y: 1, z: 1 },
    });

    expect(comp.uid).toBe("u-i-d");
    expect(comp.modelName).toBe("test");
    expect(comp.offset).toStrictEqual({ x: 1, y: 1, z: 1 });
  });

  it("creates component from string", () => {
    const json = {
      uid: "test",
      modelName: "test",
      offset: { x: 1, y: 1, z: 1 },
    };
    const comp = factory.createComponentFromJSON(so, json);

    expect(comp.uid).toBe("test");
    expect(comp.modelName).toBe("test");
    expect(comp.offset).toStrictEqual({ x: 1, y: 1, z: 1 });
  });
});
