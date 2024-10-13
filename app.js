const express = require("express"); // IMPORT EXPRESS
const app = express(); // CREATE EXPRESS APP
const ejs = require("ejs"); // IMPORT BODY-PARSER
const fs = require("fs");
const path = require("path");

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const usersFilePath = path.join(__dirname, "db.json");

// Function to read users from the file
function readUsersFromFile() {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

// Function to write users to the file
function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

const port = 5005; // PORT NUMBER

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/home", (req, res) => {
  res.render("index"); // Handle GET request for /signup
});

app.get("/", (req, res) => {
  res.render("signup"); // Handle GET request for /
});

app.post("/log", (req, res) => {
  let users = readUsersFromFile();
  const username = req.body.username;
  const password = req.body.password;
  if (
    users.find(
      (user) => user.username === username && user.password === password
    )
  ) {
    res.redirect("/home");
  } else {
    res.render("login", { errorMessage: "Invalid username or password" });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { errorMessage: null }); // Handle GET request for /login
});

app.post("/register", (req, res) => {
  let users = readUsersFromFile();
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username already exists
  if (users.find((user) => user.username === username)) {
    return res.render("signup", { errorMessage: "Username already exists" });
  }

  users.push({ username, password });
  writeUsersToFile(users);
  res.redirect("/login");

  // res.render("login"); // Handle POST request for /login
});
