import { expect } from "chai";
import Schema from "../src/schema";

describe("Schema", () => {
  let schema;

  beforeEach(() => {
    schema = new Schema({url: "smth://localhost:1234/blah"});
  });

  describe("instance", () => {
    it("is a function (to build other tuff)", () => {
      expect(schema).to.be.instanceOf(Function); // should be a class
    });

    it("has the right options stuck on it", () => {
      expect(schema.options).to.eql({url: "smth://localhost:1234/blah"});
    });
  });

});
