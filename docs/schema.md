# Modelier: Schemaing

In `modelier` terms a `schema` means basically a config that shows how your
models are reflected in the actual database layer. It defines the property types,
relationships, indexes and such.

Lets pretend you have two models:

```js
import { Record } from "modelier";

export class User extends Record {
}

export class Post extends Record {
}
```

Now, if you wish to persist those objects say in a `mongodb` database, you should
have a schema that looks somewhat like this:

```js
import { Connection } from "modelier-mongodb";
import { Schema } from "modelier";

const mongo  = new Connection("mongodb://localhost:27017/my-database");
const schema = new Schema(mongo);

schema.create("User", {
  username: String,
  password: String
});

schema.create("Post", {
  title:     String,
  text:      String,
  author:    "User", // <- a belongs-to reference
  createdAt: Date
});
```

There are several points to remember when you define your schema:

1. Model class names must be unique throughout an app
2. A schema must refer to those class names as strings when you need to specify
   a persistence config or a relationship.
3. Primary keys should not be specified; `modelier` will handle those automatically.
   This likely be a subject to configuration later, but generally considered a
   bad practice.
4. Foreign keys for model relationships also should not be specified manually.
   Instead use `property -> "Model"` references and let `modeler` handle relationships
   for you. Again, this will be a subject to a configuration later on, but generally
   considered to be against the best practices.


## Relationships

`Modelier` is built with an automatic relationships handling in mind. This allows
us to create a much more robust usage flows that enable things like, optimistic
and lazy loads, search by references, even a transparent connection of several
different databases in the same application codebase.

### Belongs-To

When you need to specify a `belongs-to` type of a relationship, simply use a
_string_ model name as the type reference on a property, for example:

```js
schema.create("User", {
  name: String
});
schema.create("Post", {
  author: "User"
  /* other props */
});
```

This configuration will automatically add the `authorId` attribute on the `Post`
model and treat it as a foreign key in all consequent operations with the database.
This also enables the `Post` model to search through the associated model. For
example:

```js
const nikolays_posts = await Post.where({author: {name: "Nikolay"}}).all();
```
