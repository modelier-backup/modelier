# Modelier: Querying Interface

The querying interface was modeled after the ruby
[ActiveRecord](http://guides.rubyonrails.org/active_record_querying.html). It
should be mostly familiar, with one difference that the query end calls—methods
like `.all()`, `.first()`, `.last()`, `.count()` return an instance of `Promise`.

```js
// to find a record by an ID
const user = await User.find("12345"); // NOTE: resolves into `null` when not found!

const admins = await User.where({admin: true}).all();
const admin  = await User.where({admin: true}).first(); // also #last();
```

The `#where()` method returns an instance of `Query` which has a bunch of extra
methods to resolve into data or add more querying parameters:

```js
const admins = await User.where({admin: true}).count();
const names  = await User.where({admin: true}).pluck("username");
```

The `#where()` method can take the following parameters:

```js
User.where({
  username: "nikolay", // direct match
  username: /nikolay/, // regexp match
  username: ["nikolay", "andrew"], // one of the options
  username: null       // checks missing properties
  name: { // querying the nested attributes
    first: "Nikolay",
    last:  "Rocks"
  }
});
```

You also can use the implicit schema references between the models with the
`#where()` method:

```js
const user  = await User.find("12345");
const posts = await Post.where({author: user});
```

This will automatically resolve the external key references and build a correct
query to the database.

## Ordering, Grouping, Aggregation

The query language also has several methods to describe various ordering and
aggregation queries:

```js
const latest = await Post.orderBy("createdAt").offset(0).limit(10);
const counts = await Post.groupBy("author").count(); // #avg("rating")...
```

The full list and docs are coming up.
