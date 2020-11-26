const express = require("express");
const mongoose = require("mongoose");

var app = express();
const cors = require("cors");
const { connectDb } = require("./service/db");
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
require("./service/routes")(app);

mongoose.connect("mongodb://localhost:27017/nejsapp", {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB");
  const PORT =  3005;
  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  });
})