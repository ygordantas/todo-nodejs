const { MongoClient, ObjectID } = require("mongodb");

let obj = new ObjectID();

console.log(obj);

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to mongoDb server");
    }
    console.log("Connected to MongoDb server");

    const db = client.db("TodoApp");
    /*
    db.collection("Todos").insertOne(
      {
        text: "it Did work!",
        completed: false
      },
      (err, result) => {
        if (err) {
          return console.log("Unable to insert Todo", err);
        }
        console.log(JSON.stringify(result.ops, null, 2));
      }
    );


    db.collection("Users").insertOne(
      {
        name: "ygor",
        age: 25
      },
      (err, result) => {
        if (err) return console.log("Unable to connect to Users");
        console.log(JSON.stringify(result.ops, null, 2));
      }
    );
    */
    client.close();
  }
);
