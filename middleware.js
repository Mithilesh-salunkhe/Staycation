const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError =  require("./utils/ExpressError");
const{listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be login to create a listing..");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
          req.flash("error", "Listing not found.");
          return res.redirect('/listings');
    }
    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
          req.flash("error", "You do not have permission to do that.");
          return res.redirect(`/listings/${id}`);
    }
    next();
}

//middleware for server side validation to add or edit listing (hotels) 
module.exports.validateListing = (req, res,err,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}
//middleware for server side validation to add a review
module.exports.validateReview = (req, res,err,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let{reviewId , id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review..!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}