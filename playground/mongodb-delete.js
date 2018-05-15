// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connected to mongodb server");

  const db = client.db("TodoApp");

  // db
  //   .collection("Todos")
  //   .findOneAndDelete({
  //     completed: false
  //   })
  //   .then(result => {
  //     console.log(result);
  //   });

  db
    .collection("Users")
    .deleteMany({
      name: "Lais"
    })
    .then(result => {
      console.log(result);
    });

  db
    .collection("Users")
    .findOneAndDelete({ _id: new ObjectID("5afac154b13dc512bc429558") })
    .then(result => {
      console.log(result);
    });

  // client.close();
});
