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
//   console.log(req.body);

//   const { username, password } = req.body;
//   const confirmPassword = req.body.repeatPassword;

//   // Check if the username already exists
//   if (password !== confirmPassword) {
//     res.render("signup", { errorMessage: "Passwords do not match" });
//   } else if (!passwordRegex.test(password)) {
//     res.render("signup", {
//       errorMessage:
//         "Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit, 1 of these special characters(@$!%*?&) and must be at least 8 characters long",
//     });
//   } else {
//     try {
//       const userObject = await userModel.findOne({ username: username });
//       if (userObject) {
//         res.redirect("/");
//       } else {
//         const user = await userModel.create(req.body);
//         console.log(user);
//         res.redirect("/login");
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
// });

const port = 4004; // PORT NUMBER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
