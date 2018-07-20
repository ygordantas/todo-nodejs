const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../modules/todo");
const { ObjectId } = require("mongodb");

const todos = [
  { _id: new ObjectId(), text: "First" },
  { _id: new ObjectId(), text: "second" }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

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
