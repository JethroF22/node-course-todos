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
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID("5afb04c6a99ce508127f4e70")
  //     },
  //     {
  //       $set: {
  //         completed: false
  //       }
  //     },
  //     {
  //       returnOriginal: false
  //     }
  //   )
  //   .then(result => {
  //     console.log(result);
  //   });

  db
    .collection("Users")
    .findOneAndUpdate(
      {
        _id: new ObjectID("5afac147bb3b1018e849b6d9")
      },
      {
        $set: {
          name: "Jethro"
        },
        $inc: {
          age: 1
        }
      },
      {
        returnOriginal: false
      }
    )
    .then(result => {
      console.log(result);
    });

  // client.close();
});
