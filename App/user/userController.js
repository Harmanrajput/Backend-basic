let User = require("./userModel")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
const multer = require("multer")
let fs = require("fs-extra")
let Path = require("path")
let _user = {};
let secret = "lovecoding"

// multer code is different in every case
//multer code
let storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let result = await User.findOne({ email: req.body.email });
        
        // in signup case use this
        // if (result) {
        //     cb('this user already exist');
        //     return;
        // } else

        // in the update case use this if 
        if(result) {
            fs.mkdir("./uploads", { recursive: true }, (err) => {
                if (err) {
                    console.log("error occured in  creating new directory", err);
                    return;
                }
            });
            cb(null, "./uploads");
        }
    },
    filename: (req, files, cb) => {
        cb(
            null,
            files.fieldname + "-" + Date.now() + Math.round(Math.random() * 1e9) +
            Path.extname(files.originalname)
        );
    },
});

const maxSize = 1 * 1024 * 1024;
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "application/pdf"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("only .png, .jpg , jpeg, pdf format allow "))
        }
    },
    limits: { fileSize: maxSize },

}).array("profileImg", 3)



// signUP with bcrypt
// _user.signup = async (req, res) => {
//     try {
//         let data = req.body;
//         let emailExist = await User.findOne({ email: data.email })
//         if (emailExist) {
//             res.json({ message: "email already exsit" })
//         } else {
//             let hashPassword = await bcrypt.hash(data.password,10)
//             data.password = hashPassword;
//             if (hashPassword) {
//                 let record = await User.create(data)
//                 if (record) {
//                     res.json({ message: "signup success", record })
//                 }
//                 else {
//                     res.json({ message: "signup failed" })
//                 }
//             }
//         }
//     } catch (err) {
//         console.log("something went wrong", err.message)
//     }
// }


// signup with multer
_user.signup = async (req, res) => {
    try {
        upload(req,res , async (err)=>{
        let data = req.body;
        // validation
        // if(!data.name){
        //     res.json({ message: "please enter valid name"})
        // }
        // if(isNaN(number(data.mob))){
        //     res.json({ message: "please enter valid mob"})
        // }
        // if(!data.email){
        //     res.json({ message: "please enter valid email"})
        // }
        let emailExist = await User.findOne({ email: data.email })
        if (emailExist) {
            res.json({ message: "email already exsit" })
        } else {
            let hashPassword = await bcrypt.hash(data.password, 10)
            data.password = hashPassword;
            
            if (hashPassword) 
            {
                if(req.files){
                    let img = req.files;
                    data.profileImg = img;
                    if(err instanceof multer.MulterError){
                        res.send(err.message);
                        return;
                    }else if(err){
                        console.log(err)
                        return res.send(err.message)
                    }
                    
                }
                let record = await User.create(data)
                if (record) {
                    res.json({ message: "signup success", record })
                }
                else {
                    res.json({ message: "signup failed" })
                }
            }

        }
    })
    } catch (err) {
        console.log("something went wrong", err.message)
    }
}

// login
_user.login = async (req, res) => {
    try {
        let data = req.body;
        let emailExist = await User.findOne({ email: data.email })
        //    console.log("helo",emailExist)
        if (!emailExist) {
            return res.json({ message: "user not registered" })
        } else {
            let comparePassword = await bcrypt.compare(data.password, emailExist.password)
            if (comparePassword) {
                let token = await jwt.sign({
                 email :emailExist.email,
                 userId :emailExist._id,
                },
                secret
                );
                res.json({ message: "logic success", emailExist , token:token})
            } else {
                res.json({ message: "wrong password" })
            }
        }
    } catch (err) {
        console.log("something went wrong", err)
    }
}

// Get record
_user.getrecord = async (req, res) => {
    try {
        let record = await User.find();
        if (record) {
            res.json({ message: "all records shown", record })
        } else {
            res.json({ message: "all record fetching failed", record })
        }
    } catch (err) {
        console.log("someting went wrong", err)
    }
}


// Get one record
_user.getOneRecord = async (req, res) => {
    try {
        let record = await User.findOne({ email: req.body.email });
        if (record) {
            res.json({ message: "record found", record })
        } else {
            res.json({ message: "record not found", record })
        }
    } catch (error) {
        console.log("something went wrong")
    }
}

// update
// _user.updateRecord = async (req, res) => {
//     try {
//         let data = req.body;
//         let record = await User.findOneAndUpdate({ email: req.params.email }, {
//             name: data.name,
//             password: data.password
//         },
//             { upsert: true, new: true })
//         if (record) {
//             res.json({ message: "record updated successfuly" })
//         } else {
//             res.json({ message: "record not updated" })
//         }
//     } catch (err) {
//         console.log("something went wrong", err)
//     }
// }

// update with multer
_user.updateRecord = async (req, res) => {
    try {
        upload(req,res , async (err)=>{
        let data = req.body;
        if(req.files){
            let img = req.files;
            data.profileImg = img;
            if(err instanceof multer.MulterError){
                res.send(err.message);
                return;
            }else if(err){
                console.log(err)
                return res.send(err.message)
            }   
        }
        let record = await User.findOneAndUpdate({ email: req.params.email }, {
            name: data.name,
            password: data.password,
            profileImg: data.profileImg
        },
            { upsert: true, new: true })
        if (record) {
            res.json({ message: "record updated successfuly",record })
        } else {
            res.json({ message: "record not updated" })
        }
    })
    } catch (err) {
        console.log("something went wrong", err)
    }
}

// delete 
_user.deleteRecord = async (req, res) => {
    try {
        let data = req.body;
        let record = await User.findOneAndDelete({ email: data.email })
        if (record) {
            res.json({ message: "record deleted successfully", record })
        } else {
            res.json({ message: "record not deleted" })
        }
    } catch (error) {
        console.log("something went wrong", err)
    }
}

module.exports = _user;