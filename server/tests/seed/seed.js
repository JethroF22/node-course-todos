const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: "user1@gmail.com",
    password: "user1!",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneID, access: "auth" }, "secretvalue")
          .toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "user2@gmail.com",
    password: "user2@",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoID, access: "auth" }, "secretvalue")
          .toString()
      }
    ]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: "Learn to use Tristana",
    completed: false,
    _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: "Kick ass with Warwick",
    completed: true,
    completedAt: 129747163874,
    _creator: userTwoID
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done())
    .catch(err => done(err));
};

module.exports = {
  todos,
  users,
  populateUsers,
  populateTodos
};
