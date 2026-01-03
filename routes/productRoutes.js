var express = require("express")

var router = express.Router()

var {productController} = require("../controllers/productController")
var upload = require("../middleware/upload")



router.post("/create",upload.single("image"),productController)

module.exports = router