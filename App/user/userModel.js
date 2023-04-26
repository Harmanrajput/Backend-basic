let mongoose = require("mongoose")
let schema = mongoose.Schema;

let User= new schema({
name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true,  
},
profileImg:{
    type:Array
},
} ,{timestamps:true})

module.exports = mongoose.model("user",User)