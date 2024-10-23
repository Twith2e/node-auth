const express = require("express");
const todoRouter = express.Router();

const { home } = require("../controllers/user.controller");
const {
  addTodo,
  editTodo,
  editPage,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

todoRouter.get("/todo", home);
todoRouter.post("/todo", addTodo);
todoRouter.get("/todo/edit/:id", editTodo);
todoRouter.get("/todo/edit", editPage);
todoRouter.put("/todo/update/:id", updateTodo);
todoRouter.delete("/todo/delete/:id", deleteTodo);

module.exports = todoRouter;
