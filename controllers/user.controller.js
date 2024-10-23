const userModel = require("../Models/user.model");
const todoModel = require("../Models/todo.model");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signuppage = (req, res) => {
  res.render("signup", { errorMessage: null });
};

const signup = async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;
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
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
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
  } else {
    console.log("Username and Password are required");
  }
};

const loginpage = (req, res) => {
  res.render("login", { errorMessage: null }); // Handle GET request for /login
};

const home = (req, res) => {
  const todoList = todoModel
    .find()
    .then((todoList) => {
      res.render("todo", { todoList });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = { signuppage, signup, loginpage, login, home };
