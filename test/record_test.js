const { expect, FakeConnection } = require("./helpers");
const { Query, Record, Schema } = require("../src");

describe("Record", () => {
  class User extends Record {
    isAdmin() {
      return this.role === "admin";
    }
  }

  let user, schema, connection;

  beforeEach(() => {
    connection = new FakeConnection();
    Schema.instances.splice(0,999); // clear out
    schema = new Schema(connection);
    schema.create("User", {username: String});

    user = new User({username: "boo", password: "blah"});
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

  describe(".tableName", () => {
    it("returns the table name for the model registered against the schema", () => {
      expect(User.tableName).to.eql("users");
    });

    it("blows up when the model is not registered", () => {
      Schema.instances.splice(0,999); // clear out
      expect(() => User.tableName).to.throw;
    });
  });

  describe(".attributes", () => {
    it("returns the model attributes config", () => {
      expect(User.attributes).to.eql({
        id:       {type: String},
        username: {type: String}
      });
    });
  });

  describe(".find(id)", () => {
    it("finds a record by an ID", function *() {
      const user = yield User.find(1);
      expect(user).to.eql(new User({id: "1", username: "user-1"}));
    });

    it("resolves to `null` if a record doesn't exist", function *() {
      const user = yield User.find("nothing");
      expect(user).to.be.null;
    });

    it("sends the right database query", function *() {
      yield User.find("smth");
      expect(connection.lastQuery).to.eql(
        "SELECT * FROM users WHERE id='smth' OFFSET 0 LIMIT 1"
      );
    });
  });

  describe(".all()", () => {
    it("extracts all the records", function *() {
      const result = yield User.all();
      expect(result).to.eql([
        new User({id: "1", username: "user-1"}),
        new User({id: "2", username: "user-2"}),
        new User({id: "3", username: "user-3"})
      ]);
    });

    it("makes the right query to the database", function *() {
      yield User.offset(0).limit(2).all();
      expect(connection.lastQuery).to.eql(
        "SELECT * FROM users OFFSET 0 LIMIT 2"
      );
    });
  });

  describe(".first()", () => {
    it("extracts the first record in the database", function *() {
      const user = yield User.first();
      expect(user).to.eql(new User({id: "1", username: "user-1"}));
    });

    it("makes the right database request", function *() {
      yield User.first();
      expect(connection.lastQuery).to.eql(
        "SELECT * FROM users OFFSET 0 LIMIT 1"
      );
    });
  });

  describe(".last()", () => {
    it("extracts the last record in the database", function *() {
      const user = yield User.last();
      expect(user).to.eql(new User({id: "3", username: "user-3"}));
    });

    it("makes the right database request", function *() {
      yield User.last();
      expect(connection.lastQuery).to.eql(
        "SELECT * FROM users OFFSET 2 LIMIT 1"
      );
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

  describe(".create(params)", () => {
    it("yields a new record", function *() {
      const result = yield User.create({username: "nikolay"});
      expect(result).to.eql(new User({id: "4", username: "nikolay"}));
    });

    it("runs the right query on the database", function *() {
      yield User.create({username: "nikolay"});
      expect(connection.lastQuery).to.eql(
        "INSERT INTO users username='nikolay'"
      );
    });
  });

  describe(".update(params)", () => {
    it("yields 'Ok'", function *() {
      expect(yield User.update({admin: true})).to.eql("Ok");
    });

    it("runs the right query on the connection", function *() {
      yield User.update({username: "blah", admin: false});
      expect(connection.lastQuery).to.eql(
        "UPDATE users SET username='blah', admin=false"
      );
    });

    it("allows to nest params", function *() {
      yield User.where({admin: true}).update({username: "nikolay"});
      expect(connection.lastQuery).to.eql(
        "UPDATE users SET username='nikolay' WHERE admin=true"
      );
    });
  });

  describe(".delete()", () => {
    it("resolves into 'Ok'", function *() {
      expect(yield User.delete()).to.eql("Ok");
    });

    it("runs the right query on the connection", function *() {
      yield User.delete();
      expect(connection.lastQuery).to.eql(
        "DELETE FROM users"
      );
    });

    it("allows to nest params", function *() {
      yield User.where({admin: true}).delete();
      expect(connection.lastQuery).to.eql(
        "DELETE FROM users WHERE admin=true"
      );
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

  describe("#attributes", () => {
    it("returns an object with attributes that are currently set on the model", () => {
      user.id = "12345";
      expect(user.attributes).to.eql({
        id:       "12345",
        username: "boo"
      });
    });

    it("skips on any arbitrary properties that are not defined in the model schema", () => {
      user.arbitraryAttrs = "blah!";
      expect(user.attributes).to.eql({username: "boo"});
    });
  });

  describe("#attributes = smth", () => {
    it("sets the new attributes on a model", () => {
      user.attributes = {username: "nikolay", id: "new-id"};
      expect(user.id).to.eql("new-id");
      expect(user.username).to.eql("nikolay");
    });

    it("resets the missing attributes", () => {
      user.attributes = {id: "new-id"};
      expect(user.id).to.eql("new-id");
      expect(user.username).to.be.undefined;
    });
  });

  describe("#save()", () => {
    describe("on a new record", () => {
      it("yields the instance back", function *() {
        const result = yield user.save();
        expect(result).to.equal(user);
      });

      it("runs an INSERT query on the databse", function *() {
        yield user.save();
        expect(connection.lastQuery).to.eql(
          "INSERT INTO users username='boo'"
        );
      });
    });

    describe("on an existing record", () => {
      beforeEach(() => {
        user.id       = "123";
        user.username = "new nikolay";
      });

      it("it yelds the instance back", function *() {
        const result = yield user.save();
        expect(result).to.equal(user);
      });

      it("runs an update query on the database", function *() {
        yield user.save();
        expect(connection.lastQuery).to.eql(
          "UPDATE users SET username='new nikolay' WHERE id='123'"
        );
      });
    });
  });

  describe("#update(params)", () => {
    beforeEach(() => user.id = "user-1");

    it("sets the new params on a record", function *() {
      yield user.update({username: "nikolay"});
      expect(user.username).to.eql("nikolay");
    });

    it("yelds the record back", function *() {
      const result = yield user.update({username: "nikolay"});
      expect(result).to.equal(user);
    });

    it("runs the right query on the database", function *() {
      yield user.update({username: "nikolay"});
      expect(connection.lastQuery).to.eql(
        "UPDATE users SET username='nikolay' WHERE id='user-1'"
      );
    });
  });

  describe("#delete()", () => {
    beforeEach(() => user.id = "user-1");

    it("yelds back the record itself", function *() {
      const result = yield user.delete();
      expect(result).to.equal(user);
    });

    it("runs the right query on the database", function *() {
      yield user.delete();
      expect(connection.lastQuery).to.eql(
        "DELETE FROM users WHERE id='user-1'"
      );
    });
  });
});
