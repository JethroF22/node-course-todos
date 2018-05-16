var MongoClient = require("mongodb").MongoClient;

var uri = "mongodb://Jethro:NodeTodo1234@ds123500.mlab.com:23500/node-todo";
MongoClient.connect(uri, function(err, client) {
  if (err) {
    return console.log(err);
  }
  console.log("Connected");
  client.close();
});
