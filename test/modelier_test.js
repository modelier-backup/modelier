import { expect } from "chai";
import Modelier from "../src/modelier";
import Schema from "../src/schema";

describe("Modelier", () => {
  it("should have a version", () => {
    expect(Modelier.VERSION).to.match(/^\d+\.\d+\.\d+$/);
  });

  it("exports the Schema", () => {
    expect(Modelier.Schema).to.equal(Schema);
  });
});
