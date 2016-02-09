var Connection = require("./connection");
var Record     = require("./record"); /* eslint no-unused-vars: 0 */

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
        this.belongsTo(model, key, {type: type});
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
   * @param {String} the reference name
   * @param {Object} {type: Class} parent reference and stuff
   * @return void
   */
  belongsTo(model, reference, options) {
    const type = options.type;
    model.attributes[`${reference}Id`] = {type: type.attributes.id.type};
  }
};
