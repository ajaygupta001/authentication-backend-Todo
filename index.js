const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const dbConnect = require("./config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      EmployeeModel.create({ name, email, password: hash })
        .then((employees) => res.json(employees))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      });
    } else {
      res.json("No Record Existed");
    }
  });
});

//create middleware to verify user
const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // Change 'cookie' to 'cookies'
  console.log(token);
  if (!token) {
    return res.json("the token was not available");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("Token is wrong");
    });
  }
  next(); // Call next() to move to the next middleware or route handler
};

app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

app.listen(3001, () => {
  console.log("Server is connected");
});
