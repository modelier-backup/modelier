var Connection   = require("./connection");

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
   * @param {Object} connection options
   * @return void
   */
  constructor(options) {
    this.connection = new Connection(options);
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
    return this.models.filter(e => e.name === Model.name).length !== 0;
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
      name:       name,
      attributes: attributes
    });
  }
};
