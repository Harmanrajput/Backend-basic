var express = require('express');
var router = express.Router();
var PRODUCT = require("../App/product/productcontroller")
const auth = require("../middleware/Auth")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/addProduct",auth.check,PRODUCT.addProduct)
router.get("/getProduct",PRODUCT.getProduct)

module.exports = router;