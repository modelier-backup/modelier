export const fakeConnection = {
  select(q) {
    const query = `SELECT * FROM ${q.model.tableName}${conditions(q)}`;

    return new Promise((resolve) => {
      const records = [
        {id: "1", username: "user-1"},
        {id: "2", username: "user-2"},
        {id: "3", username: "user-3"}
      ];
      let { offset, limit } = q.params;
      !offset && (offset = 0);
      !limit  && (limit  = records.length);

      resolve(records.slice(offset, offset + limit).map(queryfy(query)));
    });
  },
  count(q) {
    const query = `SELECT COUNT(*) FROM ${q.model.tableName}${conditions(q)}`;

    return new Promise((resolve) => {
      resolve(queryfy(query)(new Number(3)));
    });
  }
};

function queryfy(query) {
  return function(object) {
    Object.defineProperty(object, "query", {value: query});
    return object;
  };
}

// builds fake conditions clause for the SQL-ish thing
function conditions() {
  return "";
}
