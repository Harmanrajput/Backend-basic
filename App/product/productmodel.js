let mongoose = require("mongoose")
let schema = mongoose.Schema;

let Product= new schema({
productname:{
    type:String,
    required:true,
},
productquantity:{
    type:Number,
    required:true,
},
productcolor:{
    type:String,
    required:true,  
},
productImg:{
    type:Array
},
createdBy:{
    type:mongoose.Types.ObjectId,
    ref:"user"
},
} ,{timestamps:true})

module.exports = mongoose.model("product",Product)