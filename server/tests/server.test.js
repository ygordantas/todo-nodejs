const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../modules/todo");
const { ObjectId } = require("mongodb");

const todos = [
  { _id: new ObjectId(), text: "First" },
  { _id: new ObjectId(), text: "second", completed: true, completedAt: 333 }
];

beforeEach(() => Todo.remove({}).then(() => Todo.insertMany(todos)));

describe("POST /todos", () => {
  test("Should create a new todo", () => {
    const text = "test todo text";
    return request(app)
      .post("/todos")
      .send({ text })
      .then(res => {
        expect(200);
        expect(res.body.text).toBe(text);
      })
      .catch(e => console.log(e));
  });
  test("Should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  test("It should get all todos", () => {
    return request(app)
      .get("/todos")
      .then(response => {
        expect(response.body.todos.length).toBe(2);
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("GET /todos/:id", () => {
  test("It should get an specific todo by the ID provided", () => {
    return request(app)
      .get(`/todos/${todos[0]._id}`)
      .then(res => {
        expect(200);
        expect(res.body.todo.text).toBe(todos[0].text);
      });
  });
  test("Should return 404 if todo not found", () => {
    return request(app)
      .get(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(404);
      });
  });
  test("Should return 404 for non-object ids", () => {
    return request(app)
      .get("/todos/123")
      .then(res => {
        expect(404);
      });
  });
});
describe("DELETE /todos/:id", () => {
  test("Should delete a specific todo", () => {
    let id = todos[0]._id.toHexString();
    return request(app)
      .delete(`/todos/${id}`)
      .then(res => {
        expect(200);
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
        expect(404);
      });
  });
  test("Should return 404 if todo not found", () => {
    return request(app)
      .delete(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(404);
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
        expect(200);
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
        expect(200);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      });
  });
  test("should return 404 if todo not found", () =>
    request(app)
      .patch(`/todos/${new ObjectId()}`)
      .then(res => {
        expect(404);
      }));
  test("Should return 404 for non-valid object Id", () =>
    request(app)
      .patch("/todos/123")
      .then(res => {
        expect(404);
      }));
});
