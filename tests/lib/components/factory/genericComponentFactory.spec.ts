import { GenericComponentFactory } from "src/lib/components/factory/genericComponentFactory";
import { TransformComponent } from "src/lib/components/transform";
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
  const factory = container.get(GenericComponentFactory);

  it("Creates a non-special component", () => {
    const component = factory.createComponent(so, TransformComponent, {
      position: { x: 1, y: 2, z: 3 },
    });

    expect(component.uid).toBe("u-i-d");
    expect(component.name).toBe(TransformComponent.Name);
    expect(component instanceof TransformComponent).toBe(true);
    expect((component as TransformComponent).position).toStrictEqual({
      x: 1,
      y: 2,
      z: 3,
    });
  });

  it("Creates a non-special component from JSON", () => {
    const json = {
      uid: "test",
      name: TransformComponent.Name,
      position: {
        x: 1,
        y: 2,
        z: 3,
      },
    };
    const component = factory.createComponentFromJSON(so, json);

    expect(component.uid).toBe("test");
    expect(component.name).toBe(TransformComponent.Name);
    expect(component instanceof TransformComponent).toBe(true);
    expect((component as TransformComponent).position).toStrictEqual({
      x: 1,
      y: 2,
      z: 3,
    });
  });
});
