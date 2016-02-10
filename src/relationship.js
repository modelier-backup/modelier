/**
 * Describes relationships between models
 */
module.exports = class Relationship {
  constructor(params) {
    for (let key in params) {
      let value = params[key];

      if (key === "class" && typeof(value) === "function") {
        value = value.name;
      }

      this[key] = value;
    }
  }
};
