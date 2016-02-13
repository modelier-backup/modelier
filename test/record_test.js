import { expect } from "chai";
import { Record, Query } from "../src";

describe("Record", () => {
  class User extends Record {
    isAdmin() {
      return this.role === "admin";
    }
  }

  let user;
  beforeEach(() => {
    user = new User({username: "boo", password: "blah"});
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

  describe(".where(params)", () => {
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
      expect(query.conditions).to.eql({username: "boo"});
    });
  });
});
