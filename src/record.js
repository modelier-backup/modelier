/**
 * Represents a row record as per activerecord understancing of a record
 *
 */
module.exports = class Record {
  constructor(attrs) {
    Object.assign(this, attrs);
  }

  isSaved() {
    return !!this.id;
  }
};
