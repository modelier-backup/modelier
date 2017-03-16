# Modelier: CRUD Operations

All models will have a standard CRUD operations interface regardless of the actual
persistence layer provider. All those methods will return an instance of `Promise`
and are supposed to be used with either ES6 generators or the ES7 async/await
functions.

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
