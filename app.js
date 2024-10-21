const express = require("express"); // IMPORT EXPRESS
const app = express(); // CREATE EXPRESS APP
const ejs = require("ejs"); // IMPORT BODY-PARSER
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { log } = require("util");
require("dotenv").config();

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const userSchema = mongoose.Schema({
  username: { type: String, trim: true, required: true, unique: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("users", userSchema);

const todoDb = [];
const usersFilePath = path.join(__dirname, "db.json");
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
      console.log("Username does not exst");
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
  const confirmPassword = req.body.confirmpassword;

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
      const user = await userModel.create(req.body);
      console.log(user);
      res.redirect("/login");
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.get("/todo", (req, res) => {
  res.render("todo", { todoDb });
});

app.post("/todo", (req, res) => {
  const todoBody = {
    content: req.body.content,
    title: req.body.title,
  };
  todoDb.push(todoBody);
  console.log(todoDb);
  res.render("todo", { todoDb });
});

app.post("/todo/delete/:index", (req, res) => {
  const { index } = req.params;
  console.log(index);
  todoDb.pop(index);
  console.log(todoDb);
  res.redirect("/todo");
});

app.post("/todo/edit/:index", (req, res) => {
  const { index } = req.params;
  const todo = todoDb[index];
  res.render("edit", { todo, index });
});

app.post("/edit", (req, res) => {
  res.render("edit", { todo: null, index: null });
});

app.post("/todo/update/:index", (req, res) => {
  const { index } = req.params;
  const todo = todoDb[index];
  todo.content = req.body.content;
  todo.title = req.body.title;
  res.redirect("/todo");
});

const uri = process.env.MONGOOSE_URI;
console.log(uri);

const connection = async () => {
  try {
    const dbConnect = await mongoose.connect(uri);
    if (dbConnect) {
      console.log("Data connection is successful");
    }
  } catch (error) {
    console.log(error);
  }
};

connection();

const port = 5005; // PORT NUMBER

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
