import { expect } from "chai";
import { Schema, Connection, Record } from "../src";

describe("Schema", () => {
  class User extends Record {}

  let schema;

  beforeEach(() => {
    Schema.instances.splice(0,999); // clear out
    schema = new Schema({url: "smth://localhost:1234/blah"});
  });

  describe(".findFor(Model)", () => {
    it("returns the schema instance that owns the model", () => {
      schema.create("User", {username: String});
      expect(Schema.findFor(User)).to.equal(schema);
    });

    it("blows up when there is no schema registered for the model", () => {
      expect(() => Schema.findFor(User)).to.throw(
        "Can't find a schema that owns User!"
      );
    });
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

    it("must be registered in the schema instances registery", () => {
      expect(Schema.instances).to.eql([schema]);
    });
  });

  describe("#owns(Model)", () => {
    it("says `true` when the model is registered against the schema", () => {
      schema.create("User", {username: String});
      expect(schema.owns(User)).to.be.true;
    });

    it("says `false` when the model is not registered with the schema", () => {
      expect(schema.owns(User)).to.be.false;
    });
  });

  describe("#getParams(Model)", () => {
    it("returns the params hash for a Model when it's registered against the schema", () => {
      schema.create("User", {username: String});
      expect(schema.getParams(User)).to.eql({name: "User", table: "users", attributes: {username: String}});
    });

    it("returns `undefined` when the model is not regestered", () => {
      expect(schema.getParams(User)).to.be.undefined;
    });
  });

  describe("#create(name, attributes)", () => {
    it("saves the name and attributes in the schema", () => {
      schema.create("User", {username: String});
      expect(schema.models).to.eql([{name: "User", table: "users", attributes: {username: String}}]);
    });
  });
});
