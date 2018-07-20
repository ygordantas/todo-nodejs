const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { user } = require("./modules/user");
const { Todo } = require("./modules/todo");
const { ObjectId } = require("mongodb");

const app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then(doc => {
      res.send(doc);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(404).send();
  Todo.findById(id)
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.status(200).send(todo);
    })
    .catch(e => res.status(400).send());
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

module.exports = {
  app
};
