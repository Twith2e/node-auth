const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const todoModel = mongoose.model("todos", todoSchema);

module.exports = todoModel;
