const mongoose = require("mongoose");


const CampSchema = new mongoose.Schema({
    campname: {
        type:String
    },
    createdby: {
        type: Object
    },
    members: {
      type:Array  
    },
    camptimeline: {
        type:Array
    },
    campdesc: {
        type:String
    },
    campcode: {
        type:String
    }
}, {timestamps:true})

module.exports = mongoose.model("Camp", CampSchema);