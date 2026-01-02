var mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  profilePic : {
    url : {
      type : String,
    required : true
    },
    publicId : {
      type : String,
      required : true
    }
  }
})

module.exports = mongoose.model("user",userSchema)