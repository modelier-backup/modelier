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
      attributes:    build_attributes_config(attributes),
      relationships: build_relationships(attributes)
    });
  }
};

/**
 * Converts schema params into a set of attributes with types
 *
 * @param {Object} raw user defined schema attributes
 * @return {Object} normalized list of attributes
 */
function build_attributes_config(params) {
  const attrs = {id: {type: String}};

  for (let name in params) {
    const type = params[name];

    if (typeof(type) === "string") {
      // a belongs-to reference
      attrs[`${name}Id`] = {type: String};
    } else {
      attrs[name] = {type: type};
    }
  }

  return attrs;
}

/**
 * Builds the relationships config from the params
 *
 * @param {Object} raw user defined schema attributes
 * @return {Object} a normalized relationships schema
 */
function build_relationships(params) {
  const rels = {};

  for (let name in params) {
    const type = params[name];

    if (typeof(type) === "string") {
      // consider this a belongs-to reference
      rels[name] = new Relationship({
        type:       "belongs-to",
        model:      params[name],
        primaryKey: "id",
        foreignKey: `${name}Id`
      });
    }
  }

  return rels;
}
