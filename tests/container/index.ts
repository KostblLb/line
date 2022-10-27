import "reflect-metadata";
import { Container } from "inversify";
import { mockB2World, mockBox2d } from "./box2d";

export const createMockContainer = () => {
  const container = new Container({
    autoBindInjectable: true,
    skipBaseClassChecks: true,
  });

  container.bind("Box2D").toConstantValue(mockBox2d);
  container.bind("Box2D.b2World").toConstantValue(mockB2World);

  return container;
};
