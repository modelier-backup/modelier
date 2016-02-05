# Modelier

This is an attempt to define a somewhat standard interface to create the model
part of a system. In a sense it is kind of an abstract of the
[active record](https://en.wikipedia.org/wiki/Active_record_pattern) married
with `Promise` and decoupled from the actual persistence layer.

The idea here is to define an _standard_, which then can be reimplemented with
different persistence layers underneath it. The point of all this exercise is
to decouple the application level code from the persistence layer; and bring
balance to the galaxy.

## Why Active Record

Active record, as any other, has its drawbacks. But, regardless of those it is
almost unbeatably good at one thing: representing tabular data.

In the end you don't have to build your app logic on top of active record. In
many cases it is simple enough to do so, in some it isn't. But, regardless to
the case, it is much easier to talk to an active record than to a database
directly.

## Why Promises?

Don't fight it. You can't win this one....

## Modeling

In `modelier` there is an idea of I call `schema`. This thing is basically your
mapping to the persistence layer. It is not supposed to have any actual business
logic of your application. A schema simply outlines units persisted properties
and relationships between each other.

```js
import { Schema } from "modelier-mongodb";
const Model = new Schema({ url: "mongodb://localhost..."  });

export const User = new Model("User", {
  email:     String,
  username:  String,
  password:  String,
  createdAt: Date,
  updatedAt: Date
});
Model.index(User, "username");

export const Post = new Model("Post", {
  urlSlug:   String,
  title:     String,
  body:      String,
  author:    User,    // <- direct association
  createdAt: Date,
  updatedAt: Date
});
Model.index(Post, "urlSlug");
Model.index(Post, "createdAt");

export const Comment = new Model("Comment", {
  post:      Post,
  author:    User,
  text:      String,
  createdAt: Date
});
Model.index(Comment, "post");
Model.index(Comment, "createdAt");
```

There are a few important moments to consider. Firstly, primary ids are implied.
Same for relationship references, they should be done on a model to model basis
and actual references should be consistently auto-generated into `authorId` and
such by the engine.

## Indexes

The generic indexes interface should look somewhat like this:

```js
const Provider = new Schema(....);

Provider.index(Model, "field");
Provider.index(Model, ["field1", "field2"]);
```

Some specific providers might add some extra options that are related to the
databases they manage.


## Automatic Timestamps

If a model has a `createdAt` and/or `updatedAt` properties defined in a schema,
those properties will be automatically populated.

## CRUD Operations

All models will have a standard CRUD operations interface regardless of the actual
persistence layer provider. All those methods will return an instance of `Promise`
and are supposed to be used with the ES7 async/await functions.

```js
var user = await new User({username: "nikolay"}).save();
await user.update({password: "NikolayR0k5!"});
await user.delete();
```

There are also a set of similar operations that can be performed on a whole table

```js
await User.update({admin: true}); // make _everyone_ an admin
await User.delete(); // delete everything

```

__NOTE__: the table level operations are combinable with the query filters, see
below.

## Querying

Querying in `modelier` consists of basically filters and resolvers

```js
// to find a record by an ID
const user = await User.find("12345"); // NOTE: rejects into NotFound

const admins = await User.filter({admin: true}); // or #.all();
const admin  = await User.filter({admin: true}).first(); // also #last();
```

The `#filter()` method returns an extended `Promise` which has a bunch of
chained methods to aggregate data:

```js
const admins = await User.filter({admin: true}).count();
const names  = await User.filter({admin: true}).pluck("username");
```

__NOTE__ the promise that was returned only trigger the actual query once the
`then` method is called. Before that happens you can chain it as much as you like.

The `#filter()` method can take the following parameters:

```js
User.filter({
  username: "nikolay", // direct match
  username: /nikolay/, // regexp match
  username: ["nikolay", "andrew"], // one of the optins
  username: null       // checks missing properties
  name: { // querying the nested attributes
    first: "Nikolay",
    last:  "Rocks"
  }
});
```

You also can use the implicit schema references between the models with the
`#filter()` method:

```js
const user  = await User.find("12345");
const posts = await Post.filter({author: user});
```

This will automatically resolve the external key references and build a correct
query to the database.

## Ordering, Grouping, Aggregation

The query language also has several methods to describe various ordering and
aggregation queries:

```js
const latest = await Post.sort("createdAt").slice(0, 10);
const counts = await Post.group("author").count(); // #avg("rating")...
```

Most of the method names are derived from the `Array` unit in javascript, but
actually are lazy methods for the querying language.

## Custom scopes/filters

TODO


## Lifecycle Hooks

TODO


## Validation

TODO

## Copyright & License

All code in this repository is released under the terms of the MIT license

Copyright (C) 2016 Nikolay Nemshilov
