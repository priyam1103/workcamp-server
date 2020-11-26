const User = require("../models/user");
const jwt = require("jsonwebtoken");
//const config = require("../service/config");
const jwt_decode = require("jwt-decode");

module.exports = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Please login to continue" });
    }
    const token = await req.headers.authorization.split(" ")[1];
      if (!token) {
          res.status(401).json({ message: "Please login to continue" });
      } else {
          //console.log(token)
          const decoded = (jwt_decode(token))
        
          const user = await User.findOne({ emailId: decoded.email });
        //  console.log(user)
          if (!user) {
              res.status(401).json({ message: "Invalid session, Please login again" });
          } else {
              res.locals = user;
            //  console.log(user)
              next();
            ///  console.log(user);
          }
      }
  } catch (err) {
      console.log(err)
    res.status(400).json({ message: "Please try again later" });
  }
};