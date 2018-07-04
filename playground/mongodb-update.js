const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to mongoDb server");
    }
    console.log("Connected to MongoDb server");

    const db = client.db("TodoApp");

    const todos = db.collection("Todos");

    const users = db.collection("Users");

    /*
    todos
      .findOneAndUpdate(
        { _id: new ObjectID("5b2c11c7f333b81401b4f26d") },
        {
          $set: {
            completed: false
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
*/

    users
      .findOneAndUpdate(
        { _id: new ObjectID("5b3d379da0a87045943257e7") },
        {
          $set: {
            name: "Bruna"
          },
          $inc: {
            age: -1
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
    client.close();
  }
);
