import { ModelComponent } from "./components/model";
import { PhysicsBoxComponent } from "./components/physics";
import {
  TransformComponent,
  TransformComponentProps,
} from "./components/transform";
import { Scene } from "./scene";

Scene.prototype.createBox = function (transformProps: TransformComponentProps) {
  const obj = this.create();
  const cubeModelComponent = new ModelComponent({ modelName: "cube" });
  const transformComponent = new TransformComponent(transformProps);
  const physicsComponent = new PhysicsBoxComponent({});

  obj.components.add(cubeModelComponent);
  obj.components.add(transformComponent);
  obj.components.add(physicsComponent);

  this.save();

  console.log("added box", obj);
};
