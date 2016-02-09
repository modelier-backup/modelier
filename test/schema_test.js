import { expect } from "chai";
import Schema from "../src/schema";
import Connection from "../src/connection";
import Record from "../src/record";

describe("Schema", () => {
  let schema;

  beforeEach(() => {
    schema = new Schema({url: "smth://localhost:1234/blah"});
  });

  describe("instance", () => {
    it("is a Schema", () => {
      expect(schema).to.be.instanceOf(Schema);
    });

    it("has a connection object stuck with it", () => {
      expect(schema.connection).to.be.instanceOf(Connection);
      expect(schema.connection.options).to.eql({url: "smth://localhost:1234/blah"});
    });

    it("has an empty list of models", () => {
      expect(schema.models).to.eql([]);
    });
  });

  describe("#create(name, attributes)", () => {
    let model;

    beforeEach(() => {
      model = schema.create("User", {username: String, password: String});
    });

    it("creates a new Record sub-class", () => {
      expect(model.prototype.__proto__).to.equal(Record.prototype);
    });

    it("should have the right name", () => {
      expect(String(model)).to.match(/^class User/);
    });

    it("should have the right attributes", () => {
      expect(model.attributes).to.eql({
        id:       {type: Number},
        username: {type: String},
        password: {type: String}
      });
    });
  });
});
