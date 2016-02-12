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

    it("has an empty set of conditions", () => {
      expect(query.conditions).to.eql({});
    });
  });

  describe("#filter(params)", () => {
    let result;
    beforeEach(() => result = query.filter({username: "nikolay"}));

    it("creates a new Query instance", () => {
      expect(result).to.be.instanceOf(Query);
      expect(result).to.not.equal(query);
    });

    it("keeps the original model reference", () => {
      expect(result.model).to.equal(query.model);
    });

    it("adds the conditions", () => {
      expect(result.conditions).to.eql({username: "nikolay"});
    });

    it("adds more conditions in sequential calls", () => {
      expect(result.filter({isAdmin: true}).conditions).to.eql({
        username: "nikolay", isAdmin: true
      });
    });
  });
});
