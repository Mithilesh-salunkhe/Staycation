const express = require("express");
const router = express.Router({mergeParams : true});
const WrapAsync =  require("../utils/WrapAsync.js");
const {validateReview,isLoggedIn , isReviewAuthor} = require("../middleware.js"); 

const reviewController = require("../controllers/reviews.js");


//post route
router.post("/" ,isLoggedIn,validateReview,WrapAsync(reviewController.createReview));

//Delete route
router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, WrapAsync(reviewController.destroyReview));

module.exports = router;
