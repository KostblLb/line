export const mockBox2d = {
  b2BodyDef: jest.fn().mockImplementation(() => ({
    set_type: jest.fn(),
    set_position: jest.fn(),
  })),
  b2_dynamicBody: jest.fn(),
  b2PolygonShape: jest.fn().mockImplementation(() => ({
    SetAsBox: jest.fn(),
  })),
  b2Vec2: jest.fn().mockImplementation((x, y) => ({ x, y })),
};

export const mockB2World = {
  CreateBody: jest.fn().mockImplementation(() => {
    let transform: any;

    return {
      CreateFixture: jest.fn(),
      SetLinearVelocity: jest.fn(),
      SetAwake: jest.fn(),
      SetEnabled: jest.fn(),
      SetTransform: jest.fn().mockImplementation((p, q) => {
        transform = { p, q };
      }),
      GetTransform: jest
        .fn()
        .mockImplementation(() => ({
          ...transform,
          q: { GetAngle: () => transform.q },
        })),
      SetGravityScale: jest.fn(),
      SetAngularVelocity: jest.fn(),
      SetAngularDamping: jest.fn(),
    };
  }),
};
