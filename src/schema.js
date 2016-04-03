"use strict";
const pluralize    = require("pluralize");
const Relationship = require("./relationship");

module.exports = class Schema {
  /**
   * Finds the schema instance that handles a specific model
   *
   * @param {Class} Record sub-class
   * @return {Schema} model owner
   */
  static findFor(Model) {
    const schema = Schema.instances.filter(s => s.owns(Model))[0];
    if (!schema) { throw `Can't find a schema that owns ${Model.name}!`; }
    return schema;
  }

  /**
   * the list of currently known schema instances
   *
   * @return {Array} current schemas
   */
  static get instances() {
    return this._list = this._list || [];
  }

  /**
   * Basic constructor
   *
   * @param {Object} connection instance
   * @return void
   */
  constructor(connection) {
    this.connection = connection;
    this.models     = [];

    Schema.instances.push(this);
  }

  /**
   * Checks if this schema owns given Model
   *
   * @param {Class} a Record sub-class
   * @return {Boolean} check result
   */
  owns(Model) {
    return this.getParams(Model) !== undefined;
  }

  /**
   * Returns the params thing for a model
   *
   * @param {Class} a Record sub-class
   * @return {Object|undefined} the params
   */
  getParams(Model) {
    return this.models.filter(e => e.name === Model.name)[0];
  }

  /**
   * Registers a new models handler
   *
   * @param {String} model name
   * @param {Object} attributes
   * @return void
   */
  create(name, attributes) {
    this.models.push({
      name:          name,
      table:         pluralize(name.toLowerCase()),
      attributes:    build_attributes_config(name, attributes),
      relationships: build_relationships(name, attributes)
    });
  }
};

/**
 * Converts schema params into a set of attributes with types
 *
 * @param {String} the model name
 * @param {Object} raw user defined schema attributes
 * @return {Object} normalized list of attributes
 */
function build_attributes_config(model, params) {
  const attrs = {id: {type: String}};

  for (let name in params) {
    const type           = params[name];
    const belongs_to_ref = is_belongs_to_ref(type);
    const has_many_ref   = is_has_many_ref(model, type);

    if (belongs_to_ref) {
      attrs[belongs_to_ref.foreignKey] = {type: String};
    } else if (!has_many_ref) {
      attrs[name] = {type: type};
    }
  }

  return attrs;
}

/**
 * Builds the relationships config from the params
 *
 * @param {String} the model name
 * @param {Object} raw user defined schema attributes
 * @return {Object} a normalized relationships schema
 */
function build_relationships(model, params) {
  const rels = {};

  for (let name in params) {
    const type           = params[name];
    const belongs_to_ref = is_belongs_to_ref(type);
    const has_many_ref   = is_has_many_ref(model, type);

    if (belongs_to_ref) {
      rels[name] = new Relationship(
        Object.assign({type: "belongs-to"}, belongs_to_ref)
      );
    } else if (has_many_ref) {
      rels[name] = new Relationship(
        Object.assign({type: "has-many"}, has_many_ref)
      );
    }
  }

  return rels;
}

/**
 * Tries to identify a belong-to relationship config and build the options
 *
 * @param {mixed} a property type reference
 * @return {Object|undefined} relationship options
 */
function is_belongs_to_ref(type) {
  if (typeof(type) === "string") {
    return {
      model:      type,
      primaryKey: "id",
      foreignKey: `${type.toLowerCase()}Id`
    };
  }
}

/**
 * Tries to identify a has many relationship
 *
 * @param {String} model name
 * @param {mixed} a property type reference
 * @return {Object|undefined} relationship options
 */
function is_has_many_ref(model, type) {
  if (type.constructor === Array && type.length === 1 && typeof(type[0]) === "string") {
    return {
      model:      type[0],
      primaryKey: "id",
      foreignKey: `${model.toLowerCase()}Id`
    };
  }
}
