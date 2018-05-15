const { ObjectID } = require("mongodb");
const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// const id = "5afb2ae1766b3f04a46332d8";

// if (!ObjectID.isValid(id)) {
//   console.log("ID not valid");
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo", todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("Id not found");
//     }
//     console.log("Todo By Id", todo);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const userID = "5afb10982de032097827e2ba";

User.findById(userID)
  .then(user => {
    if (!user) {
      return console.log("ID not found");
    }
    console.log("User by ID", user);
  })
  .catch(err => {
    console.log(err);
  });
