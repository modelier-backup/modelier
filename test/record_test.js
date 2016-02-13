import { expect } from "chai";
import { Record, Query, Schema } from "../src";

describe("Record", () => {
  class User extends Record {
    isAdmin() {
      return this.role === "admin";
    }
  }

  let user, schema;
  beforeEach(() => {
    user = new User({username: "boo", password: "blah"});

    Schema.instances.splice(0,999); // clear out
    schema = new Schema({url: "smth://localhost:1234/blah"});
    schema.create("User", {username: String});
  });

  describe(".schema", () => {
    it("returns the reference to the schema that handles the model", () => {
      expect(User.schema).to.equal(schema);
    });

    it("blows up when there is no schema regisetered against the model", () => {
      Schema.instances.splice(0,999); // clear out
      expect(() => User.schema).to.throw;
    });
  });

  describe("basic instanciation", () => {
    it("assigns the attributes", () => {
      expect(user).to.include({username: "boo", password: "blah"});
    });

    it("is JSON exportable", () => {
      expect(JSON.stringify(user)).to.eql('{"username":"boo","password":"blah"}');
    });
  });

  describe("#isSaved()", () => {
    it("returns false if the user doesn't have an id", () => {
      expect(user.isSaved()).to.be.false;
    });

    it("returns true if it has an id", () => {
      user.id = "123";
      expect(user.isSaved()).to.be.true;
    });
  });

  describe(".where(conditions)", () => {
    let query;
    beforeEach(() => {
      query = User.where({username: "boo"});
    });

    it("creates a Query", () => {
      expect(query).to.be.instanceOf(Query);
    });

    it("referes to the User model", () => {
      expect(query.model).to.equal(User);
    });

    it("passes through the conditions", () => {
      expect(query.params).to.eql({conditions: {username: "boo"}});
    });
  });

  describe(".orderBy(field, direction)", () => {
    let query;
    beforeEach(() => query = User.orderBy("username", "desc"));

    it("creates a Query", () => {
      expect(query).to.be.instanceOf(Query);
    });

    it("referes to the User model", () => {
      expect(query.model).to.equal(User);
    });

    it("passes through the order params", () => {
      expect(query.params).to.eql({orderBy: [["username", "desc"]]});
    });
  });

  describe(".groupBy(field)", () => {
    let query;
    beforeEach(() => query = User.groupBy("username"));

    it("creates a Query", () => {
      expect(query).to.be.instanceOf(Query);
    });

    it("referes to the User model", () => {
      expect(query.model).to.equal(User);
    });

    it("passes through the order params", () => {
      expect(query.params).to.eql({groupBy: ["username"]});
    });
  });

  describe(".limit(size)", () => {
    let query;
    beforeEach(() => query = User.limit(10));

    it("creates a Query", () => {
      expect(query).to.be.instanceOf(Query);
    });

    it("referes to the User model", () => {
      expect(query.model).to.equal(User);
    });

    it("passes through the order params", () => {
      expect(query.params).to.eql({limit: 10});
    });
  });

  describe(".offset(position)", () => {
    let query;
    beforeEach(() => query = User.offset(20));

    it("creates a Query", () => {
      expect(query).to.be.instanceOf(Query);
    });

    it("referes to the User model", () => {
      expect(query.model).to.equal(User);
    });

    it("passes through the order params", () => {
      expect(query.params).to.eql({offset: 20});
    });
  });
});
