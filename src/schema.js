var Connection = require("./connection");

module.exports = function Schema(options) {
  function Model() {
    /* build the actual model */
  }

  Model.connection = new Connection(options);

  return Model;
};
