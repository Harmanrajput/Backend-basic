let Product = require("./productmodel")

let _product = {};

_product.addProduct= async(req,res)=>{
    try {
        let data  =req.body;
        data.createdBy=req.userId;
        let product = await Product.create(data);
        if(product){
            res.json({ message: "product added", product })
        }else{
            res.json({ message: "product not added" })
        }
    } catch (err) {
        console.log("something went wrong", err.message)
    
    }
}


_product.getProduct =async(req,res)=>{
    try {
        // let product = await Product.find().populate("createdBy","name");
        let product= await Product.aggregate([
            {
                $match:{productcolor:"black"}
            },

            {
                $group:{_id:"$productname",totalquantity:{$sum:"$productquantity"}}
            }
        ]);
        if (product) {
            res.json({ message: "all products shown", product })
        } else {
            res.json({ message: "all products fetching failed", record })
        }
    } catch (err) {
        console.log("someting went wrong", err)
        
    }
}
module.exports = _product;