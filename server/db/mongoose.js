const mongoose = require("mongoose");

const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/TodoApp";

mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = {
  mongoose
};
