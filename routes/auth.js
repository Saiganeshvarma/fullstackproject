var express = require("express")

var router = express.Router()

var upload = require("../middleware/upload")
var {registerController,loginController} = require("../controllers/authController")

router.post("/register",upload.single("profilePic"),registerController)

router.post("/login",loginController)



module.exports = router 