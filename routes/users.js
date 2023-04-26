var express = require('express');
var router = express.Router();
const USER = require("../App/user/userController")
const auth = require("../middleware/Auth")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register",USER.signup);
router.post("/login",USER.login);
router.get("/getRecord",USER.getrecord);
router.get("/getOneRecord",USER.getOneRecord);
router.put("/recordUpdate/:email",auth.check,USER.updateRecord);
router.delete("/recordDelete",USER.deleteRecord);


module.exports = router;
