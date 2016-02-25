# Modelier: Schemaing

__NOTE__ this is a slightly outdated version of the docs

In `modelier` there is an idea of I call `schema`. This thing is basically your
mapping to the persistence layer. It is not supposed to have any actual business
logic of your application. A schema simply outlines units persisted properties
and relationships between each other.

```js
import { Schema } from "modelier-mongodb";
const schema = new Schema({ url: "mongodb://localhost..."  });

export const User = schema.create("User", {
  email:     String,
  username:  String,
  password:  String,
  createdAt: Date,
  updatedAt: Date
});
schema.index(User, "username");

export const Post = schema.create("Post", {
  urlSlug:   String,
  title:     String,
  body:      String,
  author:    User,    // <- direct association
  createdAt: Date,
  updatedAt: Date
});
schema.index(Post, "urlSlug");
schema.index(Post, "createdAt");

export const Comment = schema.create("Comment", {
  post:      Post,
  author:    User,
  text:      String,
  createdAt: Date
});
schema.index(Comment, "post");
schema.index(Comment, "createdAt");
```

There are a few important moments to consider. Firstly, primary ids are implied.
Same for relationship references, they should be done on a model to model basis
and actual references should be consistently auto-generated into `authorId` and
such by the engine.

## Indexes

The generic indexes interface should look somewhat like this:

```js
const schema = new Schema(....);

schema.index(Model, "field");
schema.index(Model, ["field1", "field2"]);
```

Some specific providers might add some extra options that are related to the
databases they manage.

## Relationships

Relationships between records can be either defined implicitly through attributes

```js
const User = schema.create("User", {
  username: String
});

const Post = schema.create("Post", {
  title: String,
  author: User  // <- implicit relationship reference
});
```

Or they can be created explicitly with the `schema.belongsTo(...)` method

```js
const User = schema.create("User", {
  username: String
});

const Post = schema.create("Post", {
  title: String
});

schema.belongsTo(Post, {author: User});
```

In both cases we will automatically generate attributes named `referenceId`. In
this case `authorId` on the referee class.
