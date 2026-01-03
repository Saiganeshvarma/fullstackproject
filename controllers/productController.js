

var {uploadToCloudinary} = require("../helpers/cloudinaryHelper")

var Product = require("../models/Products")


var productController = async(req,res)=>{
    try{
        var {title,description,price} = req.body 
        if(!title || !description || !price){
            return res.status(200).json({message : "fields are missing"})
        }
        if(!req.file){
            return res.status(200).json({message : "image missing"})
        }

        var {url,publicId} = await uploadToCloudinary(req.file.path)

        var  newProduct = await Product.create({
            title,
            description,
            price,
            image : {
                url,
                publicId
            }


            
        })
       return res.status(200).json({message : "pruduct added sucessfully",a : newProduct})


    }catch(error){
        console.log("error",error);
    }
}

module.exports = {productController}