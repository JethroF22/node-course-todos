const mongoose = require("mongoose");

const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/TodoApp";
console.log(uri);

mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = {
  mongoose
};
