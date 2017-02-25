const { expect, FakeConnection } = require("./helpers");
const { Query, Record, Schema } = require("../src");

describe("Query", () => {
  let connection, schema, query;
  class User extends Record {}

  beforeEach(() => {
    Schema.instances.splice(0,999); // clear out

    connection = new FakeConnection();
    schema     = new Schema(connection);

    schema.create("User", {username: String});
    query = new Query(User);
  });

  describe("instance", () => {
    it("has a reference to the model", () => {
      expect(query.model).to.equal(User);
    });

    it("has an empty set of params", () => {
      expect(query.params).to.eql({});
    });
  });

  describe("#where(params)", () => {
    let result;
    beforeEach(() => result = query.where({username: "nikolay"}));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the conditions", () => {
      expect(result.params).to.eql({
        conditions: {username: "nikolay"}
      });
    });

    it("adds more conditions in sequential calls", () => {
      expect(result.where({isAdmin: true}).params).to.eql({
        conditions: {
          username: "nikolay", isAdmin: true
        }
      });
    });
  });

  describe("#orderBy(field, direction)", () => {
    let result;
    beforeEach(() => result = query.orderBy("username"));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the order params to the query", () => {
      expect(result.params).to.eql({
        orderBy: [["username", "asc"]]
      });
    });

    it("keeps adding ordering params on sequential calls", () => {
      const next = result.orderBy("isAdmin", "desc");
      expect(next.params).to.eql({
        orderBy: [["username", "asc"], ["isAdmin", "desc"]]
      });
    });
  });

  describe("#groupBy(field)", () => {
    let result;
    beforeEach(() => result = query.groupBy("username"));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the order params to the query", () => {
      expect(result.params).to.eql({
        groupBy: ["username"]
      });
    });

    it("keeps adding ordering params on sequential calls", () => {
      const next = result.groupBy("isAdmin");
      expect(next.params).to.eql({
        groupBy: ["username", "isAdmin"]
      });
    });
  });

  describe("#limit(size)", () => {
    let result;
    beforeEach(() => result = query.limit(10));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the order params to the query", () => {
      expect(result.params).to.eql({limit: 10});
    });
  });

  describe("#offset(position)", () => {
    let result;
    beforeEach(() => result = query.offset(20));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the order params to the query", () => {
      expect(result.params).to.eql({offset: 20});
    });
  });

  describe("#all()", () => {
    it("returns a promise", () => {
      expect(query.all()).to.be.instanceOf(Promise);
    });

    it("resolves the promise into a list of models", function *() {
      const result = yield query.all();
      expect(result).to.eql([
        new User({id: "1", username: "user-1"}),
        new User({id: "2", username: "user-2"}),
        new User({id: "3", username: "user-3"})
      ]);
    });
  });

  describe("#count()", () => {
    it("returns a promise", () => {
      expect(query.count()).to.be.instanceOf(Promise);
    });

    it("resolves into a number from the connection", function *() {
      const result = yield query.count();
      expect(result).to.eql(3);
    });
  });

  describe("#first()", () => {
    it("returns a promise", () => {
      expect(query.first()).to.be.instanceOf(Promise);
    });

    it("resolves the promise into the first record", function *() {
      const result = yield query.first();
      expect(result).to.eql(new User({id: "1", username: "user-1"}));
    });
  });

  describe("#last()", () => {
    it("returns a promise", () => {
      expect(query.last()).to.be.instanceOf(Promise);
    });

    it("resolves the promise into the last record", function *() {
      const result = yield query.last();
      expect(result).to.eql(new User({id: "3", username: "user-3"}));
    });
  });

  describe("#insert()", () => {
    it("returns a promise", () => {
      expect(query.insert({username: "Nikolay"})).to.be.instanceOf(Promise);
    });

    it("returns a new record", function *() {
      const user = yield query.insert({username: "nikolay"});
      expect(user).to.eql([
        new User({id: "4", username: "nikolay"})
      ]);
    });

    it("makes the right call into the database", function *() {
      yield query.insert({username: "nikolay"});
      expect(connection.lastQuery).to.eql(
        "INSERT INTO users username='nikolay'"
      );
    });
  });

  describe("#update(params)", () => {
    it("returns a promise", () => {
      expect(query.update({username: "boo"})).to.be.instanceOf(Promise);
    });

    it("resolves into 'Ok'", function *() {
      const result = yield query.update({username: "boo"});
      expect(result).to.be.eql("Ok");
    });

    it("makes the right query to the database", function *() {
      yield query.update({username: "boo"});
      expect(connection.lastQuery).to.eql(
        "UPDATE users SET username='boo'"
      );
    });
  });

  describe("#delete()", () => {
    it('returns a promise', () => {
      expect(query.delete()).to.be.instanceOf(Promise);
    });

    it("resolves into 'Ok'", function *() {
      expect(yield query.delete()).to.eql("Ok");
    });

    it("makes the right query to the database", function *() {
      yield query.delete();
      expect(connection.lastQuery).to.eql(
        "DELETE FROM users"
      );
    });
  });
});
