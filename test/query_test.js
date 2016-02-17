import { expect } from "chai";
import { fakeConnection } from "./helpers";
import { Query, Record, Schema } from "../src";

describe("Query", () => {
  const schema = new Schema(fakeConnection);
  schema.create("User", {username: String});
  class User extends Record {}

  let query;
  beforeEach(() => query = new Query(User));

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

    it("resolves the promise into a list of models", async () => {
      const result = await query.all();
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

    it("resolves into a number from the connection", async () => {
      const result = await query.count();
      expect(result).to.eql(new Number(3));
    });
  });

  describe("#first()", () => {
    it("returns a promise", () => {
      expect(query.first()).to.be.instanceOf(Promise);
    });

    it("resolves the promise into the first record", async () => {
      const result = await query.first();
      expect(result).to.eql(new User({id: "1", username: "user-1"}));
    });
  });

  describe("#last()", () => {
    it("returns a promise", () => {
      expect(query.last()).to.be.instanceOf(Promise);
    });

    it("resolves the promise into the last record", async () => {
      const result = await query.last();
      expect(result).to.eql(new User({id: "3", username: "user-3"}));
    });
  });
});
