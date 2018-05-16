const { ObjectID } = require("mongodb");

const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// Todo.remove({}).then(result => {
//   console.log(result);
// });

Todo.findByIdAndRemove("5afc2819cf56092fc09802c0").then(todo =>
  console.log(todo)
);
