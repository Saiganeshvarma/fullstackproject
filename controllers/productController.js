const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
var Product = require("../models/Products");



var createProduct = async (req, res) => {
    try {
        var { title, description, price } = req.body

        if (!title || !description || !price) {
            return res.status(200).json({ message: "fill the fields" })
        }

        if (!req.file) {
            return res.status(200).json({ message: "missing the image" })
        }

        var { url, publicId } = await uploadToCloudinary(req.file.path)

        var newProduct = await Product.create({
            title,
            description,
            price,
            image: { url, publicId }
        })

        return res.status(201).json({
            message: "successfully added the product",
            product: newProduct
        })

    } catch (error) {
        console.log("error", error)
    }
}

var getAllProducts = async(req,res)=>{
    try{
        var allProducts = await Product.find()
        if(allProducts.length == 0){
            return res.status(200).json({message : "no products found"})
        }
        return res.status(200).json({message : allProducts})

    }catch(error){
        console.log("error",error);
    }
}


var getSingleProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var singleProduct = await Product.findById(id)
        return res.status(200).json({message : singleProduct})

    }catch(error){
        console.log("error",error);
    }
}

var updateProduct = async(req,res)=>{
    try{
        var id =  req.params.id 
        var {title,description,price} = req.body 
        if(!title || !description || !price){
            return res.status(200).json({message : "feilds are missing "})
        }
        if(!req.file){ 
            return res.status(200).json({message : "image not found"})

        }
        var {url,publicId} = await uploadToCloudinary(req.file.path)

        var updatedProduct = await Product.findByIdAndUpdate(id,{
            title,
            description,
            price,
            image: { url, publicId }

        })
        return res.status(201).json({message : updatedProduct})


    }catch(error){
        console.log("error",error);
    }
}

var deleteProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var deleted = await Product.findByIdAndDelete(id)
        return res.status(200).json({message : "product deleted"})

    }catch(error){
        console.log("error",error);
    }
}







module.exports = {
    createProduct,getAllProducts,getSingleProduct,deleteProduct,updateProduct
}
