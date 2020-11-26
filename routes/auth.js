const express = require("express");

const route = express.Router();

const { AddUser } = require("../handlers/auth");

const {getUsers} = require("../handlers/userDetails");

route.post("/authenticate", AddUser);
route.get("/getUsers", getUsers);

module.exports = route;