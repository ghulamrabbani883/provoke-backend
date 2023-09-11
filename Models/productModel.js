const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    plans:{
        type:String,
        enum:['Mobile', 'Basic','Standard','Premium']
    },
    interval:{
        type:String,
        enum:['Monthly','Yearly']
    },
    price:{
        type:Number,
        required:true,
    },
    quality:{
        type:String,
        enum:['Good', 'Better','Best']
    },
    resolution:{
        type:String,
        enum:['480p', '1080p','4k+HDR']
    },
    devices:[{
        type:String
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const productModel = mongoose.model('product', productSchema)
module.exports = {productModel}