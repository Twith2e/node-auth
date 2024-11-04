const express = require("express");
const app = express();
const ejs = require("ejs");
const dbconnection = require("./Db.config/dbconnect");
const userRoute = require("./Routes/user.route");
const todoRoute = require("./routes/todo.route");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

//MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

app.use("/", userRoute);
app.use("/", todoRoute);

dbconnection(process.env.MONGOOSE_URI);

const port = 4004; // PORT NUMBER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
