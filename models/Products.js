var mongoose = require("mongoose")


var productsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    image : {
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

module.exports = mongoose.model("product",productsSchema)