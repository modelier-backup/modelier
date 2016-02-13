module.exports = class Query {
  constructor(model, conditions) {
    this.model      = model;
    this.conditions = conditions || {};
  }

  where(params) {
    return new Query(this.model,
      Object.assign({}, this.conditions, params)
    );
  }
};
