import { expect } from "chai";
import Record from "../src/record";

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
});
