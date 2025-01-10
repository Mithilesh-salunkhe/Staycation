const express = require("express");
const router = express.Router();
const WrapAsync =  require("../utils/WrapAsync.js");
const {isLoggedIn , isOwner,validateListing} = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");


router.route("/")
    //Index Route
    .get(WrapAsync(listingController.index))
    //create route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,WrapAsync(listingController.createListing));

//Filter route
router.get("/filter" , WrapAsync(listingController.filterByCategory));


//Add Route
router.get("/new" ,isLoggedIn, listingController.renderNewForm);

router.route("/:id")    
    //show route
    .get(WrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,WrapAsync(listingController.updateListing))
    //delete route
    .delete(isLoggedIn,isOwner,WrapAsync(listingController.destroyListing));



//Edit route
router.get("/:id/edit" ,isLoggedIn,isOwner,WrapAsync(listingController.renderEditForm));



module.exports = router;