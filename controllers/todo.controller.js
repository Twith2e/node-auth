const todoModel = require("../Models/todo.model");

const addTodo = async (req, res) => {
  const todoBody = {
    content: req.body.content,
    title: req.body.title,
  };
  const todoList = await todoModel.create(todoBody);
  console.log(todoList);

  res.redirect("/todo");
};

const editTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const toBeEdited = await todoModel.findById(id);
    res.render("edit", { toBeEdited: toBeEdited });
  } catch (error) {
    console.log(error.message);
  }
};

const editPage = (req, res) => {
  res.render("edit", { toBeEdited: null });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }
    res.redirect("/todo");
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Server error");
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).send("Todo not found"); // Return a 404 if not found
    }
    return res.redirect("/todo");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error"); // Handle server error
  }
};

module.exports = { addTodo, editTodo, editPage, updateTodo, deleteTodo };
