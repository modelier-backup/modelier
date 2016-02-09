var Connection = require("./connection");
var Record     = require("./record"); /* eslint no-unused-vars: 0 */

module.exports = class Schema {
  constructor(options) {
    this.connection = new Connection(options);
    this.models     = [];
  }

  create(name, attributes) {
    const record = eval(`class ${name} extends Record {}`);

    record.attributes = {id: {type: Number}};

    for (let key in attributes) {
      record.attributes[key] = {type: attributes[key]};
    }

    return record;
  }
};
