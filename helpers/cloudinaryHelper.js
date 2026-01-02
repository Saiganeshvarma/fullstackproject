var cloudinary = require("../config/cloudinary")


var uploadToCloudinary = async(filepath)=>{
  try{
    var result = await cloudinary.uploader.upload(filepath,{
      folder : "uploads",
      resource_type : "image"
    })
    return {
      url : result.secure_url,
      publicId : result.public_id

    }

  }catch(error){
    console.log("error",error);
  }
}

module.exports = {
  uploadToCloudinary
}