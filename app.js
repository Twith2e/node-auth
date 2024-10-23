const express = require("express"); // IMPORT EXPRESS
const app = express(); // CREATE EXPRESS APP
const ejs = require("ejs"); // IMPORT BODY-PARSER
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const fs = require("fs");
const path = require("path");
const { log } = require("util");
require("dotenv").config();

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(methodOverride("_method"));
app.use(express.json());

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "username already exists"],
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("users", userSchema);

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

const port = 5000; // PORT NUMBER
const uri = process.env.MONGOOSE_URI;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

app.get("/", (req, res) => {
  res.render("signup", { errorMessage: null }); // Handle GET request for /
});

app.post("/log", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const userObject = await userModel.findOne({ username: username });
    if (!userObject) {
      console.log("Username does not exist");
    } else if (userObject.password !== password) {
      console.log("Incorrect Password");
    } else {
      res.redirect("/todo");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { errorMessage: null }); // Handle GET request for /login
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.repeatPassword;

  // Check if the username already exists
  if (password !== confirmPassword) {
    res.render("signup", { errorMessage: "Passwords do not match" });
  } else if (!passwordRegex.test(password)) {
    res.render("signup", {
      errorMessage:
        "Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit, 1 of these special characters(@$!%*?&) and must be at least 8 characters long",
    });
  } else {
    try {
      const userObject = await userModel.findOne({ username: username });
      if (userObject) {
        res.redirect("/");
      } else {
        const user = await userModel.create(req.body);
        console.log(user);
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.get("/todo", (req, res) => {
  const todoList = todoModel
    .find()
    .then((todoList) => {
      res.render("todo", { todoList });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/todo", async (req, res) => {
  const todoBody = {
    content: req.body.content,
    title: req.body.title,
  };
  const todoList = await todoModel.create(todoBody);
  console.log(todoList);

  res.redirect("/todo");
});

app.delete("/todo/delete/:id", async (req, res) => {
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
});

app.post("/todo/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const toBeEdited = await todoModel.findById(id);
    res.render("edit", { toBeEdited: toBeEdited });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/edit", (req, res) => {
  res.render("edit", { toBeEdited: null });
});

app.put("/todo/update/:id", async (req, res) => {
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
});

const connection = async () => {
  try {
    const dbConnect = await mongoose.connect(uri);
    if (dbConnect) {
      console.log("Data connection is successful");
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

connection();
