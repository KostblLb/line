import * as utils from "../../../src/lib/utils";

describe("utils", () => {
  describe("uid", () => {
    test("makes uid", () => {
      const getRandom = jest.spyOn(utils, "getRandom");
      jest.spyOn(Date, "now").mockImplementation(() => 1);
      jest
        .mocked(getRandom)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(7)
        .mockReturnValueOnce(8);
      expect(utils.uid()).toBe("1f-3d-5b-79-97-b5-d3-f1");
    });
  });
});
