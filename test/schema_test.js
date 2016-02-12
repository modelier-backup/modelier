import { expect } from "chai";
import { Schema, Connection, Record, Relationship } from "../src";

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
      expect(model.prototype).to.be.instanceOf(Record);
    });

    it("should have the right name", () => {
      expect(model.name).to.eql("User");
    });

    it("should have the right attributes", () => {
      expect(model.attributes).to.eql({
        id:       {type: String},
        username: {type: String},
        password: {type: String}
      });
    });

    it("adds the model to the list of schema models", () => {
      expect(schema.models).to.eql([model]);
    });

    it("sets the schema reference on the model", () => {
      expect(model.schema).to.equal(schema);
    });
  });

  describe("#create(name, attributes) - with a belongsTo relationship", () => {
    let User, Post;

    beforeEach(() => {
      User = schema.create("User", {
        username: String
      });
      Post = schema.create("Post", {
        title:  String,
        author: User
      });
    });

    it("creates an relationship attributes", () => {
      expect(Post.attributes).to.eql({
        id:       {type: String},
        title:    {type: String},
        authorId: {type: String}
      });
    });

    it("creates a `blongsTo` mapping on the model", () => {
      expect(Post.relationships).to.eql({
        author: new Relationship({
          schema:     schema,
          name:       "author",
          type:       "belongs-to",
          class:      "User",
          primaryKey: "id",
          foreignKey: "authorId"
        })
      });
    });
  });
});
