/**
 * Represents a row record as per activerecord understancing of a record
 *
 */
var Query  = require("./query");
var Schema = require("./schema");

module.exports = class Record {
  static where(conditions) {
    return new Query(this).where(conditions);
  }

  static orderBy(field, direction) {
    return new Query(this).orderBy(field, direction);
  }

  static groupBy(field) {
    return new Query(this).groupBy(field);
  }

  static limit(size) {
    return new Query(this).limit(size);
  }

  static offset(position) {
    return new Query(this).offset(position);
  }

  static find(id) {
    return new Query(this).where({id: String(id)}).first();
  }

  static all() {
    return new Query(this).all();
  }

  static first() {
    return new Query(this).first();
  }

  static last() {
    return new Query(this).last();
  }

  static update(params) {
    return new Query(this).update(params);
  }

  static delete() {
    return new Query(this).delete();
  }

  static get schema() {
    return Schema.findFor(this);
  }

  static get tableName() {
    return this.schema.getParams(this).table;
  }

  constructor(attrs) {
    Object.assign(this, attrs);
  }

  isSaved() {
    return !!this.id;
  }

  update(params) {
    return new Query(this.constructor).where({id: this.id})
      .update(params).then(() => Object.assign(this, params));
  }

  delete() {
    return new Query(this.constructor).where({id: this.id})
      .delete().then(() => this);
  }
};
