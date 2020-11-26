const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const workSchema = new mongoose.Schema({
    work_date_time: {type:String,default: new Date()},
    work_id: {type:String,default: uuidv4().toString().substr(0, 6) + (Math.floor(Math.random() * 90000) + 10000).toString()},
    type: {type:String},
    fileid: {type:String},
    workdesc: {type:String},
    work_added_by_name: {type:String},
    work_added_by_image: {type:String},
    comments: {type:Array},
    todoMembers:{type:Array,default:null}
})

module.exports = mongoose.model("Work", workSchema);

