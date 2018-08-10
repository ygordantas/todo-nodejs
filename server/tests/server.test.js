const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../modules/todo");
const { User } = require("./../modules/user");
const { ObjectId } = require("mongodb");
const { todos, populate, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populate);

describe("POST /todos", () => {
  test("Should create a new todo", () => {
    const text = "test todo text";
    return request(app)
      .post("/todos")
      .send({ text })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.text).toBe(text);
      })
      .catch(e => console.log(e));
  });
  test("Should not create todo with invalid body data", () =>
    request(app)
      .post("/todos")
      .send({})
      .then(res => {
        expect(res.status).toBe(400);
      })
      .then(() => {
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
        });
      }));
});

describe("GET /todos", () => {
  test("It should get all todos", () => {
    return request(app)
      .get("/todos")
      .then(response => {
        expect(response.body.todos.length).toBe(2);
        expect(response.status).toBe(200);
      });
  });
});

describe("GET /todos/:id", () => {
  test("It should get an specific todo by the ID provided", () => {
    return request(app)
      .get(`/todos/${todos[0]._id}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.todo.text).toBe(todos[0].text);
      });
  });
  test("Should return 404 if todo not found", () => {
    return request(app)
      .get(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(res.status).toBe(404);
      });
  });
  test("Should return 404 for non-object ids", () => {
    return request(app)
      .get("/todos/123")
      .then(res => {
        expect(res.status).toBe(404);
      });
  });
});
describe("DELETE /todos/:id", () => {
  test("Should delete a specific todo", () => {
    let id = todos[0]._id.toHexString();
    return request(app)
      .delete(`/todos/${id}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.todo._id).toBe(id);
      })
      .then(res => {
        return Todo.findById(id).then(todo => {
          expect(todo).toBeFalsy();
        });
      })
      .catch(e => {
        throw e;
      });
  });
  test("Should return 404 for non-object ids", () => {
    return request(app)
      .delete("/todos/123adc")
      .then(res => {
        expect(res.status).toBe(404);
      });
  });
  test("Should return 404 if todo not found", () => {
    return request(app)
      .delete(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PATCH /todos/:id", () => {
  test("should update the given todo", () => {
    const id = todos[0]._id.toHexString();
    const text = "text from update";
    return request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: true })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      });
  });
  test("Should clear completedAt when todo is not completed", () => {
    const id = todos[1]._id.toHexString();
    return request(app)
      .patch(`/todos/${id}`)
      .send({ completed: false })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      });
  });
  test("should return 404 if todo not found", () =>
    request(app)
      .patch(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(res.status).toBe(404);
      }));
  test("Should return 404 for non-valid object Id", () =>
    request(app)
      .patch("/todos/123")
      .then(res => {
        expect(res.status).toBe(404);
      }));
});

describe("GET users/me", () => {
  test("Should return user if authenticated", () =>
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }));
  test("Should return 401 if not authenticated", () =>
    request(app)
      .get("/users/me")
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({});
      }));
});

describe("POST /users", () => {
  test("Should create a user ", () => {
    const email = "test@email.com";
    const password = "abc123!";
    return request(app)
      .post("/users")
      .send({ email, password })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.header).toHaveProperty("x-auth");
        expect(res.body).toHaveProperty("_id");
        expect(res.body.email).toBe(email);
        return User.findOne({ email }).then(user => {
          expect(user).toBeTruthy();
          expect(user.email).toBe(email);
          expect(user.password).not.toBe(password);
        });
      });
  });
  test("Should return validation errors if request invalid ", () => {
    const email = "";
    const password = "123";
    return request(app)
      .post("/users")
      .send({ email, password })
      .then(res => {
        expect(res.status).toBe(400);
      });
  });
  test("Should not create user if email in use", () =>
    request(app)
      .post("/users")
      .send({ email: users[0].email, password: users[0].password })
      .then(res => {
        expect(res.status).toBe(400);
      }));
});

describe("POST /users/login", () => {
  test("should login user and return auth token", () =>
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: users[1].password })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.header).toHaveProperty("x-auth");
        return User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[0]).toHaveProperty("access", "auth");
            expect(user.tokens[0]).toHaveProperty(
              "token",
              res.header["x-auth"]
            );
          })
          .catch(e => {
            throw new Error(e);
          });
      })
      .catch(e => {
        throw new Error(e);
      }));
  test("should reject invalid login", () =>
    request(app)
      .post("/users/login")
      .send({ email: "notRegister@email.com", password: "itMightWork" })
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.header).not.toHaveProperty("x-auth");
      }));
});
