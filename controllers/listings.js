const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs" ,{allListing});
}

module.exports.renderNewForm = (req,res)=>{ 
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews" , populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested does not exists");
        res.redirect("./listings");
    }
    res.render("./listings/show.ejs" , {listing});
};

module.exports.createListing = async (req, res)=>{
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()


    let url = req.file.path;
    let filename = req.file.filename;

    

    const newListing = new Listing( req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    req.flash("success" , "New listing created !");
    res.redirect("/listings");  
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("./listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,h_300,w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params; 
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    //code logic for uploading / reseting new image
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
     
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success" , "listing updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "listing deleted !");
    res.redirect("/listings");
}

module.exports.filterByCategory = async (req,res)=> {
    const {category} = req.query; //// Read category from query parameter
    try{
        // If no category is provided, return all listings
        if (!category) {
            return res.status(400).send('Category is required');
      }
      // If no category is provided, return all listings
        if (!category) {
            return res.status(400).send('Category is required');
      }

        const filteredListing = await Listing.find({category : category});
        res.render("./listings/index.ejs" , {allListing : filteredListing });

    }catch(err){
        req.flash("error" , "Error fetching listings by category");
        res.redirect("/listings");
    }
}