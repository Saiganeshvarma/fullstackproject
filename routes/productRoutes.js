var express = require("express")
var router = express.Router()

var {createProduct, getAllProducts, getSingleProduct, deleteProduct, updateProduct} = require("../controllers/productController")

var upload = require("../middleware/upload")

router.post("/create",upload.single("image"),createProduct)

router.get("/allProducts",getAllProducts)
router.get("/singleProduct/:id",getSingleProduct)

router.put("/update/:id",upload.single("image"),updateProduct)

router.delete("/delete/:id",deleteProduct)


module.exports = router 
