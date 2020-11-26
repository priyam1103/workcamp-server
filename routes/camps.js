const express = require("express");
const route = express.Router();
const { addCamp,mycamps,getcamp ,addWork,getcampWork,addComment,joinCamp,addTodo,updateWork,updateTodo} = require("../handlers/camp");
const  auth  = require("../middleware/auth");

route.post("/addCamp", auth, addCamp);
route.get("/myCamps", auth, mycamps);
route.post("/joinCamp",auth,joinCamp)
route.get("/getcamp/:camp_id", auth, getcamp)
route.post("/addwork", auth, addWork)
route.post("/addtodo", auth, addTodo)
route.get("/getworkcamp/:camp_id/:work_id", auth, getcampWork)
route.post("/addComment/:camp_id/:work_id", auth, addComment)
route.post("/updatework", auth, updateWork)
route.post("/updatetodo",auth,updateTodo)

module.exports = route;