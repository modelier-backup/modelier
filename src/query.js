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

  offset(position) {
    return new Query(this.model, merge(this.params, {offset: position}));
  }

  limit(size) {
    return new Query(this.model, merge(this.params, {limit: size}));
  }

  count() {
    return this.connection.count(this);
  }

  all() {
    return this.connection.select(this).then(records => {
      return records.map(record => new this.model(record));
    });
  }

  first() {
    return this.offset(0).limit(1).all().then(records => records[0] || null);
  }

  last() {
    return this.count().then(count => {
      return count === 0 ? null :
        this.offset(count - 1).limit(1).all().then(records => records[0] || null);
    });
  }

// privateish

  get connection() {
    return this.model.schema.connection;
  }
};

function merge() {
  const args = Array.prototype.slice.call(arguments, 0);
  return Object.assign.apply(Object, [{}].concat(args));
}
