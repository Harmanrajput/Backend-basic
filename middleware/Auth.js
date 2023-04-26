let jwt = require("jsonwebtoken")
let secret = "lovecoding"
let auth = {}

auth.check = async(req,res,next)=>{
    try {
        let token =req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        req.userId = decoded.userId;
        req.email = decoded.email;
        

        if(decoded){
            console.log("token verfied");
            next();
        }else{
            res.send("Invalid token")
        }

    } catch (err) {
        res.send(err.message)
    }
}

module.exports = auth ;