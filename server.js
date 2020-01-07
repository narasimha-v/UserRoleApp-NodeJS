//Run in non-PROD mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", error => console.error(error));
mongoose.connection.once("open", () => console.log("Connected to Mongo DB"));

//Connection to routes
app.use("/api/users", require("./routes/api/user"));

//Start server
app.listen(process.env.PORT || 3000, err => {
  if (!err) {
    console.log("Server started");
  }
});
