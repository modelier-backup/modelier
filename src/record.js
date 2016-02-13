/**
 * Represents a row record as per activerecord understancing of a record
 *
 */
var Query = require("./query");

module.exports = class Record {
  constructor(attrs) {
    Object.assign(this, attrs);
  }

  isSaved() {
    return !!this.id;
  }

  static where(options) {
    return new Query(this).where(options);
  }
};
