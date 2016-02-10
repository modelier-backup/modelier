var Connection   = require("./connection");
var Record       = require("./record");
var Relationship = require("./relationship");

module.exports = class Schema {
  /**
   * Basic constructor
   *
   * @param {Object} connection options
   * @return void
   */
  constructor(options) {
    this.connection = new Connection(options);
    this.models     = [];
  }

  /**
   * Creates a new record sub-class with all the configuratins
   *
   * @param {String} name
   * @param {Object} attributes
   * @return {Class} record sub-class
   */
  create(name, attributes) {
    const Model = eval(`class ${name} extends Record {}`);

    Model.attributes = {id: {type: String}};
    Model.schema     = this;
    this.models.push(Model);

    this.attributes(Model, attributes);

    return Model;
  }

  /**
   * Appends the attributes on a model
   *
   * @param {Class} a Record sub-class
   * @param {Object} attributes schema
   * @return void
   */
  attributes(Model, attributes) {
    for (let key in attributes) {
      const type = attributes[key];

      if (isBelongsToReference(type)) {
        this.belongsTo(Model, {[key]: type});
      } else if (isHasManyReference(type)) {
        this.hasMany(Model, {[key]: type[0]});
      } else {
        Model.attributes[key] = {type: type};
      }
    }
  }

  /**
   * Creates a belongs-to reference between Record sub-classes
   *
   * @param {Class} a Record sub-class
   * @param {Object} {attribute: Class} parent reference and stuff
   * @return void
   */
  belongsTo(Model, references) {
    for (let name in references) {
      const primaryKey   = "id";
      const foreignKey   = `${name}Id`;
      const relationship = new Relationship({
        schema:     this,
        name:       name,
        type:       "belongs-to",
        class:      references[name],
        primaryKey: primaryKey,
        foreignKey: foreignKey
      });

      Model.attributes[foreignKey] = {type: String};
      Model.relationships = Object.assign({}, Model.relationships, {
        [name] : relationship
      });
    }
  }

  /**
   * Registeres a has many reference on the model
   *
   * @param {Class} a Record sub-class model
   * @param {Object} the references list
   * @return void
   */
  hasMany(Model, references) {
    // TODO stuff
    return Model + references;
  }
};

// checks if the type is a belongs-to reference
function isBelongsToReference(type) {
  return isModelReference(type);
}

// checks if the type is a has-many reference
function isHasManyReference(type) {
  return type instanceof Array && isModelReference(type[0]);
}

// checks if the type is a Record sub-class reference
function isModelReference(type) {
  return typeof(type) === "string" || type.prototype instanceof Record;
}
