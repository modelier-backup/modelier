/**
 * Represents an abstract query to the database
 */
module.exports = class Query {
  constructor(model, params) {
    this.model  = model;
    this.params = params || {};
  }

  where(conditions) {
    const newConditions = merge(this.params.conditions, conditions);
    return new Query(this.model, merge(this.params, {conditions: newConditions}));
  }

  orderBy(field, direction) {
    const order    = [field, direction || "asc"];
    const newOrder = (this.params.orderBy||[]).concat([order]);
    return new Query(this.model, merge(this.params, {orderBy: newOrder}));
  }

  groupBy(field) {
    const newGroup = (this.params.groupBy||[]).concat([field]);
    return new Query(this.model, merge(this.params, {groupBy: newGroup}));
  }

  count() {
    return Promise.resolve(); // TODO make the actual query later
  }
};

function merge() {
  const args = Array.prototype.slice.call(arguments, 0);
  return Object.assign.apply(Object, [{}].concat(args));
}
