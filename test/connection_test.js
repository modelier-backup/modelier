import { expect } from "chai";
import { Connection } from "../src";

describe("Connection", () => {
  let connection;

  beforeEach(() => {
    connection = new Connection({url: "smth://localhost:12345/qwer"});
  });

  it("return an instance of Connection", () => {
    expect(connection).to.be.instanceOf(Connection);
  });

  it("has the right options", () => {
    expect(connection.options).to.eql({url: "smth://localhost:12345/qwer"});
  });
});
