const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");
const { User } = require("../models/user");
const { todos, users, populateUsers } = require("./seed/seed");

describe("POST /todos", () => {
  beforeEach(done => {
    Todo.remove({}).then(() => done());
  });

  it("should create a new todo", function(done) {
    this.timeout(0);

    const text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  beforeEach(done => {
    Todo.insertMany(todos).then(() => done());
  });
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-ObjectIDs", done => {
    request(app)
      .get(`/todos/12345678}`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should return a 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if ObjectID is invalid", done => {
    request(app)
      .delete(`/todos/12345678}`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  before(done => {
    Todo.remove({})
      .then(() => {
        return Todo.insertMany(todos);
      })
      .then(() => done());
  });

  it("should update the todo", done => {
    const hexId = todos[0]._id.toHexString();
    const updates = {
      completed: true,
      text: "master playing with Caitlyn"
    };
    request(app)
      .patch(`/todos/${hexId}`)
      .send(updates)
      .expect(200)
      .expect(res => {
        const updatedObject = res.body.todo;
        expect(updatedObject.text).toBe(updates.text);
        expect(updatedObject.completed).toBe(true);
        expect(updatedObject.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const hexId = todos[1]._id.toHexString();
    const updates = { completed: false, text: "Master warwick" };
    request(app)
      .patch(`/todos/${hexId}`)
      .send(updates)
      .expect(200)
      .expect(res => {
        const updatedObject = res.body.todo;
        expect(updatedObject.text).toBe(updates.text);
        expect(updatedObject.completed).toBe(false);
        expect(updatedObject.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe("Tests for /users", () => {
  beforeEach(populateUsers);

  describe("GET /users/me", () => {
    it("should return user if authenticated", done => {
      request(app)
        .get("/users/me")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it("should return 401 if user not authenticated", done => {
      request(app)
        .get("/users/me")
        .expect(401)
        .expect(res => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe("POST /users", () => {
    it("should create a user", done => {
      const email = "test@test.com";
      const password = "1234test";

      request(app)
        .post("/users")
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.headers["x-auth"]).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({ email })
            .then(user => {
              expect(user).toExist();
              expect(user.password).toNotBe(password);
              done();
            })
            .catch(err => done(e));
        });
    });

    it("should return validation errors if request is invalid", done => {
      const email = "notavalidemail";
      const password = "short";

      request(app)
        .post("/users")
        .send({ email, password })
        .expect(400)
        .end(done);
    });

    it("should not create the user if the email is already in use", done => {
      const email = "user2@gmail.com";
      const password = "password";

      request(app)
        .post("/users")
        .send({ email, password })
        .expect(400)
        .end(done);
    });
  });

  describe("POST /users/login", () => {
    it("should login user and return auth token", done => {
      const { email, password, _id } = { ...users[1] };

      request(app)
        .post("/users/login")
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.headers["x-auth"]).toExist();
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }

          User.findById(_id)
            .then(user => {
              expect(user.tokens[0]).toInclude({
                access: "auth",
                token: res.headers["x-auth"]
              });
              done();
            })
            .catch(err => done(err));
        });
    });

    it("should reject invalid login", done => {
      const { email, _id, password } = { ...users[1] };

      request(app)
        .post("/users/login")
        .send({ email, password: password + "adkhfjueiw" })
        .expect(400)
        .expect(res => {
          expect(res.headers["x-auth"]).toNotExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(_id)
            .then(user => {
              expect(user.tokens.length).toBe(0);
              done();
            })
            .catch(err => done(err));
        });
    });
  });
});
