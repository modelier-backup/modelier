import { expect } from "chai";
import { Query, Record } from "../src";

describe("Query", () => {
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
});
