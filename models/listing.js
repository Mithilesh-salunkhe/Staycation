//cleint side schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const listingSchema = mongoose.Schema({
    title :{
        type:String,
        required:true
    }, 
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country :{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review" //review model
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum:["mountains","rooms","trending","amazing pools","camping","frams","artic","domes","games","iconic cities"],
        required:true
    }
});

//middleware for handling deltion in reviews
listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;