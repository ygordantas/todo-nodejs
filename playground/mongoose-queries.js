const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/modules/todo");
const { User } = require("./../server/modules/user");
/*
const id = "5b4f6ebaf8d7052120f95465";

if (ObjectId.isValid(id)) {
  Todo.findById(id).then(todo => {
    if (!todo) return console.log("ID not found");
    console.log(todo);
  });
} else {
  console.log("Invalid ID");
}
*/

const id = "5b3e47ce59dc063f6c847978";

if (!ObjectId.isValid(id)) return console.log("INVALID ID");

User.findById(id)
  .then(user => {
    if (!user) return console.log("ID NOT FOUND");
    console.log("User:", user);
  })
  .catch(e => console.log(e));
