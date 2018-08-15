const { ObjectID } = require("mongodb");
const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: "user1@email.com",
    password: "user1Pass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "user2@email.com",
    password: "user2DontPass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
];
const todos = [
  { _id: new ObjectID(), text: "First", _creator: userOneId },
  {
    _id: new ObjectID(),
    text: "second",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populate = () => Todo.remove({}).then(() => Todo.insertMany(todos));

const populateUsers = () =>
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  });

module.exports = {
  todos,
  populate,
  users,
  populateUsers
};
