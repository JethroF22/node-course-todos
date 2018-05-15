// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connected to mongodb server");

  const db = client.db("TodoApp");

  // const cursor = db.collection("Todos").find();
  // cursor
  //   .count()
  //   .then(count => {
  //     console.log(`Todos count: ${count}`);
  //   })
  //   .catch(err => {
  //     console.log("Error:", err);
  //   });

  const cursor = db.collection("Users").find({
    name: "Lais"
  });
  cursor
    .toArray()
    .then(docs => {
      console.log("Users");
      console.log(JSON.stringify(docs, undefined, 2));
    })
    .catch(err => {
      console.log("Error:", err);
    });

  // client.close();
});
