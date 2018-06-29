const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to mongoDb server");
    }
    console.log("Connected to MongoDb server");

    const db = client.db("TodoApp");

    /*
    db.collection("Todos")
      .find({ _id: new ObjectID("5b2c11c7f333b81401b4f26d") })
      .toArray()
      .then(docs => {
        console.log(JSON.stringify(docs, null, 2));
      })
      .catch(err => {
        console.log(err);
      });

    db.collection("Todos")
      .find()
      .count()
      .then(count => console.log(`There are ${count} Todos on your list`))
      .catch(err => console.log(err));

    client.close();
    */

    db.collection("Users")
      .find({ name: "Bruna" })
      .toArray()
      .then(res => console.log(res))
      .catch(err => console.log(err));

    client.close();
  }
);
