const { expect } = require("chai");

global.expect = expect;

exports.FakeConnection = class FakeConnection {
  get records() {
    return this._records || [
      {id: "1", username: "user-1"},
      {id: "2", username: "user-2"},
      {id: "3", username: "user-3"}
    ];
  }

  set records(list) {
    this._records = list;
  }

  select(q) {
    this.queries.push(`SELECT * FROM ${q.model.tableName}${conditions(q)}`);

    return new Promise((resolve) => {
      let { offset, limit, conditions } = q.params;

      !conditions && (conditions = {});
      !offset && (offset = 0);
      !limit  && (limit  = this.records.length);

      resolve(
        this.records.filter(r => {
          return conditions.id ? r.id == conditions.id : r;
        })
        .slice(offset, offset + limit)
      );
    });
  }

  count(q) {
    this.queries.push(`SELECT COUNT(*) FROM ${q.model.tableName}${conditions(q)}`);

    return new Promise((resolve) => {
      resolve(this.records.length);
    });
  }

  insert(q, params) {
    const data = [].concat(params);
    data.forEach(params =>
      this.queries.push(`INSERT INTO ${q.model.tableName} ${hashToClauses(params).join(", ")}`)
    );

    return new Promise((resolve) => {
      resolve(data.map(params => {
        const record = Object.assign({id: String(this.records.length + 1)}, params);
        this.records = this.records.concat(record);
        this.records.push(record);
        return record;
      }));
    });
  }

  update(q, params) {
    return this.select(q).then(records => {
      this.queries.push(`UPDATE ${q.model.tableName} SET ${hashToClauses(params).join(", ")}${conditions(q)}`);

      records.forEach(entry => {
        for (let key in params) {
          entry[key] = params[key];
        }
      });

      return "Ok";
    });
  }

  delete(q) {
    return this.select(q).then(records => {
      this.queries.push(`DELETE FROM ${q.model.tableName}${conditions(q)}`);

      records.forEach(record => {
        const index = this.records.indexOf(record);
        this.records.splice(index, 1);
      });

      return "Ok";
    });
  }

  get queries() {
    return this._queries = this._queries || [];
  }

  get lastQuery() {
    return this.queries[this.queries.length - 1];
  }
};

// builds fake conditions clause for the SQL-ish thing
function conditions(q) {
  let clauses = "";
  const { conditions, offset, limit } = q.params;

  if (conditions) {
    clauses += ` WHERE ${hashToClauses(conditions).join(" AND ")}`;
  }

  if (offset !== undefined) {
    clauses += ` OFFSET ${offset}`;
  }

  if (limit !== undefined) {
    clauses += ` LIMIT ${limit}`;
  }

  return clauses;
}

function hashToClauses(hash) {
  const clauses = [];

  for (let key in hash) {
    clauses.push(`${key}=${
      typeof(hash[key]) === "boolean" ? hash[key] : `'${hash[key]}'`
    }`);
  }

  return clauses;
}
