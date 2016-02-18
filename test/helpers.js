export * from "chai";

export class FakeConnection {
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

  get queries() {
    return this._queries = this._queries || [];
  }

  get lastQuery() {
    return this.queries[this.queries.length - 1];
  }
}

// builds fake conditions clause for the SQL-ish thing
function conditions(q) {
  let clauses = "";
  const { conditions, offset, limit } = q.params;

  if (conditions) {
    let wheres = [];

    for (let key in conditions) {
      wheres.push(`${key}='${conditions[key]}'`);
    }
    clauses += ` WHERE ${wheres.join(" AND ")}`;
  }

  if (offset !== undefined) {
    clauses += ` OFFSET ${offset}`;
  }

  if (limit !== undefined) {
    clauses += ` LIMIT ${limit}`;
  }

  return clauses;
}
