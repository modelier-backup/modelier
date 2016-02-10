var Connection = require("./connection");
var Record     = require("./record");

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
    const model = eval(`class ${name} extends Record {}`);

    model.attributes = {id: {type: Number}};
    model.schema     = this;
    this.models.push(model);

    for (let key in attributes) {
      const type = attributes[key];

      if (type.prototype instanceof Record) {
        this.belongsTo(model, {[key]: type});
      } else {
        model.attributes[key] = {type: type};
      }
    }

    return model;
  }

  /**
   * Creates a belongs-to reference between Record sub-classes
   *
   * @param {Class} child record class
   * @param {Object} {attribute: Class} parent reference and stuff
   * @return void
   */
  belongsTo(model, references) {
    for (let name in references) {
      const parent     = references[name];
      const foreignKey = `${name}Id`;
      const primaryKey = "id";

      model.attributes[foreignKey] = {type: parent.attributes[primaryKey].type};

      model.belongsTo = Object.assign({}, model.belongsTo, {
        [name]: {
          class:      parent,
          foreignKey: foreignKey,
          primaryKey: primaryKey
        }
      });
    }
  }
};
