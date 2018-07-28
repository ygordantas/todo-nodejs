const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { user } = require("./modules/user");
const { Todo } = require("./modules/todo");
const { ObjectId } = require("mongodb");
const _ = require("lodash");

const app = express();

const port = process.env.PORT || 3000;

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
  let { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(404).send();
  Todo.findById(id)
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.status(200).send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.delete("/todos/:id", (req, res) => {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(404).send();
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.status(200).send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.patch("/todos/:id", (req, res) => {
  let { id } = req.params;
  let body = _.pick(req.body, ["text", "completed"]); // {text: some text, completed: true}
  if (!ObjectId.isValid(id)) return res.status(404).send();

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, body, { new: true })
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.status(200).send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  app
};
