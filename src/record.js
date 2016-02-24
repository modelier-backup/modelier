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

  static get attributes() {
    return this.schema.getParams(this).attributes;
  }

  constructor(attrs) {
    this.attributes = attrs;
  }

  get attributes() {
    const attrs = {};

    for (let name in this.constructor.attributes) {
      if (Object.hasOwnProperty.call(this, name)) {
        attrs[name] = this[name];
      }
    }

    return attrs;
  }

  set attributes(attrs) {
    Object.assign(this, attrs);

    for (let name in this.constructor.attributes) {
      if (!Object.hasOwnProperty.call(attrs, name)) {
        delete(this[name]);
      }
    }
  }

  isSaved() {
    return !!this.id;
  }

  update(params) {
    this.attributes = Object.assign({}, this.attributes, params);
    return new Query(this.constructor).where({id: this.id}).update(params).then(() => this);
  }

  delete() {
    return new Query(this.constructor).where({id: this.id}).delete().then(() => this);
  }
};
