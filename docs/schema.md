# Modelier: Schemaing

In `modelier` terms, `schema` basically means a config that shows how your
models are reflected onto the persistence layer. It defines the property types,
relationships, indexes and such.

To give you an example, lets say you have two models in your application business
logic:

```js
import { Record } from "modelier";

export class User extends Record {
  // logic...
}

export class Post extends Record {
  // logic...
}
```

Now, if you wish to persist those objects say in a `mongodb` database, to do so
you need to define persistence schemas for those models:

```js
import { Schema } from "modelier";
import { Connection } from "modelier-mongodb";

const connection  = new Connection("mongodb://localhost:27017/my-database");
const MongoSchema = Schema.with({ connection });

const user = new MongoSchema("User", {
  username: String,
  password: String
});

const post = new MongoSchema("Post", {
  title:     String,
  text:      String,
  createdAt: Date
});
```

In this example `MongoSchema` is a schema constructor attached to a specific
mongodb database connection. The `user` is a schema for the `"User"` model we
defined earlier, and `post` corresponds to the `"Post"` model in the business
logic.

## Relationships

`Modelier` is built with an automatic relationships handling in mind. This allows
us to create a much more robust usage flows that enable things like, optimistic
and lazy loads, search by references, even a transparent connection of several
different databases in the same application codebase.

Three are several methods on `Schema` instances that allow the relationships
to be defined within the schemas:

### Belongs-To Relationships

To create belongs-to relationships between schemas, use the `#belongsTo` method
on the persistence schemas defined earlier:

```js
post.belongsTo("author", user);
```

This construction, will automatically add the `userId` attribute on the `post`
schema and use it as a foreign key to link the models together. If you wish to
have a different configuration, pass is a third parameter to the call:

```js
post.belongsTo("author", user, {foreignKey: "authorId"});
```

Once you have this relationship defined, you can extract the actual related
records in your business logic like so:

```js
const post   = await Post.find(params.id);
const author = await post.author;
```

Essentially a belongs-to reference call in this case is an equivalent to this

```js
const post   = await Post.find(params.id);
const author = await User.find(post.userId);
```

But it also does memoization and assignments tracking in a developer friendly
way.

You also can use the relationship references to query data:

```js
const nikolays_posts = await Post.where({author: {username: "nikolay"}}).all();
```

And you can lazy-load relationships within a single query:

```js
const recent_posts = await Post.orderBy("createdAt", "desc").preload("author").all();
```

This will optimize the query to two calls to the database: the first one will
load all the posts that match a criteria and the second one will load all the
`User` instances that are mentioned in those posts.

## Haz Many Relationships

To define a has-many type of relationships, please use the `#hasMany` method on
schema instances. For example:

```js
user.hasMany("posts", post);
```

Again, by default it will automatically create has-many relationship with the
`userId` attribute that will be automatically added to the `post` schema. If you
wish to change that, use a third argument for the options:

```js
user.hasMany("posts", post, {foreignKey: "authorId"});
```

Essentially a `has-many` relationship is an implied `belongs-to` relationship,
which works the other way around. Once you have it defined you can query on
the related models:

```js
const user = await User.find(params.id);
const posts = await user.posts.all();

// or with parameters
const last_posts = await user.posts.orderBy("createdAt", "desc").limit(10).all();
```

Again, the has-many reference is just a shortcut for this:

```js
const user  = await User.find(params.id);
const posts = await Post.where({userId: user.id}).all();
```

But it abstract the relationship implementation details and allows us to work
some more magic into the concept.
