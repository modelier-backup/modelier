import { expect } from "chai";
import { Relationship } from "../src";

describe("Relationship", () => {
  it("converts functions to function names", () => {
    const relationship = new Relationship({
      type:  "belongsTo",
      model: "User"
    });

    expect(relationship.params).to.eql({
      type:  "belongsTo",
      model: "User"
    });
  });
});
