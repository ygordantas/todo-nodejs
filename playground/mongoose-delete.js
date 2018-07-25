const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/modules/todo");

Todo.findByIdAndRemove("5b58a1a8b6cf7f0839b3fd38").then(todo => {
  console.log("Todo removed:", todo);
});
