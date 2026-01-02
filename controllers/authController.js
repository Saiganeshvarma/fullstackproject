var User = require("../models/User")
var bcyrpt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var {uploadToCloudinary }= require("../helpers/cloudinaryHelper")



var registerController = async(req,res)=>{
  try{
    var {name,email,password} = req.body
    if(!name || !email || !password){
      return res.status(200).json({message : "feilds are missing"})
    }

    var userExists = await User.findOne({email}) 
    if(userExists){
      return res.status(200).json({message : "user already exists"})
    }
    var {url,publicId} = await uploadToCloudinary(req.file.path)
    var salt = await bcyrpt.genSalt(10)
    var hasedPassword = await bcyrpt.hash(password,salt)
    var newUser = await User.create({
      name ,
      email ,
      password : hasedPassword,
      profilePic : {
        url ,
        publicId 
      }

    })
    return res.status(201).json({newUser})


  }catch(error){
    console.log("error",error);
  }
}

var loginController = async(req,res)=>{
  try{
    var {email,password} = req.body
    var userExists = await User.findOne({email})
    if(!userExists){
      return res.status(200).json({message : "no account found register"})
    }
    var isPassword = await bcyrpt.compare(password,userExists.password)
    if(!isPassword){
      return res.status(200).json({message : "invalid password"})
    }

    var token = jwt.sign({
      id : userExists._id 
    },process.env.JWT_TOKEN ,{expiresIn : "1d"})


    res.status(200).json({message : "login sucessfull",webToken : token})




  }catch(error){
    console.log("error");
  }
}


module.exports = {
  registerController,loginController
}