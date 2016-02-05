import { expect } from "chai";
import Modelier from "../src/modelier";

describe("Modelier", () => {
  it("should have a version", () => {
    expect(Modelier.VERSION).to.match(/^\d+\.\d+\.\d+$/);
  });
});
