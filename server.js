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

mongoose.connect("mongodb+srv://priyam1103:priyam7035@cluster0.w6j7n.mongodb.net/workcamp?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB");
  const PORT =  3005;
  app.listen(process.env.PORT || PORT, () => {
    console.log("Listening on port: " + PORT);
  });
})