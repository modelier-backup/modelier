import { expect } from "chai";
import Relationship from "../src/relationship";

describe("Relationship", () => {
  it("converts functions to function names", () => {
    const relationship = new Relationship({
      type:  "belongs-to",
      class: class Boo {}
    });

    expect(relationship).to.include({
      type:  "belongs-to",
      class: "Boo"
    });
  });
});
