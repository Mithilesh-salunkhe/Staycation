const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview =  async(req,res)=>{
    let listing = await Listing.findById(req.params.id);//to access the listing of particular :id...
    let newReview = new Review(req.body.review);// to store the new rating passed by user in backend..
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New review created !");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let{id , reviewId} = req.params;                                                                                

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted !");
    res.redirect(`/listings/${id}`);
};

