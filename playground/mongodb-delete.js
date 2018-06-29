const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to mongoDb server");
    }
    console.log("Connected to MongoDb server");

    const db = client.db("TodoApp");

    const users = db.collection("Users");

    /*
    db.collection("Todos")
      .deleteMany({text: 'Eat lunch'})
      .then(res => console.log(res))
      .catch(err => console.log(err));


    db.collection("Todos")
      .deleteOne({ text: "to be deleted" })
      .then(res => console.log(res))
      .catch(err => console.log(err));

      
    db.collection("Todos")
      .findOneAndDelete({ text: "to be deleted" })
      .then(res => console.log(res));
      */

    users
      .deleteMany({ name: "ygor" })
      .then(res => console.log(res.result))
      .catch(err => console.log(err));

    users
      .findOneAndDelete({ _id: new ObjectID("5b2fd011a0a8704594325534") })
      .then(res => console.log(res))
      .catch(err => console.log(err));

    client.close();
  }
);
