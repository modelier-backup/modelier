import { expect } from "chai";
import Schema from "../src/schema";
import Connection from "../src/connection";

describe("Schema", () => {
  let schema;

  beforeEach(() => {
    schema = new Schema({url: "smth://localhost:1234/blah"});
  });

  describe("instance", () => {
    it("is a function (to build other tuff)", () => {
      expect(schema).to.be.instanceOf(Function); // should be a class
    });

    it("has a connection object stuck with it", () => {
      expect(schema.connection).to.be.instanceOf(Connection);
      expect(schema.connection.options).to.eql({url: "smth://localhost:1234/blah"});
    });
  });

});
