import { ModelComponentFactory } from "src/lib/components/factory/modelComponentFactory";
import { RendererComponentFactory } from "src/lib/components/factory/rendererComponentFactory";
import { BasicMaterial } from "src/lib/rendering/basicMaterial";
import { SceneObject } from "src/lib/sceneObject";
import { createMockContainer } from "tests/container";

jest.mock("src/shaders/basic/fragment.frag", () => "");
jest.mock("src/shaders/basic/vertex.vert", () => "");

jest.mock("src/lib/utils", () => ({
  uid: jest.fn().mockReturnValue("u-i-d"),
}));

describe("RendererComponentFactory", () => {
  const container = createMockContainer();
  const so = new SceneObject();
  const factory = container.get(RendererComponentFactory);
  const modelFactory = container.get(ModelComponentFactory);

  it("fails to create if model not found on scene object", () => {
    expect(() => {
      const mat = new BasicMaterial(so);
      factory.createComponent(so, {
        material: mat,
      });
    }).toThrowError("Model component not found on scene object");
  });

  it("creates component from scratch", () => {
    const modelComponent = modelFactory.createComponent(so, {
      modelName: "cube",
    });
    so.components.push(modelComponent);

    const mat = new BasicMaterial(so);
    const comp = factory.createComponent(so, {
      material: mat,
    });

    expect(comp.uid).toBe("u-i-d");
    expect(comp.material).toBe(mat);
  });

  it("creates component from string", () => {
    const modelComponent = modelFactory.createComponent(so, {
      modelName: "cube",
    });
    so.components.push(modelComponent);

    const json = {
      uid: "test",
      material: "BasicMaterial",
    };
    const comp = factory.createComponentFromJSON(so, json);

    expect(comp.uid).toBe("test");
    expect(comp.material instanceof BasicMaterial).toBe(true);
  });
});
