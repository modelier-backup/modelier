module.exports = function Schema(options) {
  function Model() {
    /* build the actual model */
  }

  Model.options = options || {};

  return Model;
};
