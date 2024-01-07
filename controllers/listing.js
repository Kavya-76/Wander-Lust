const Listing = require("../models/listing");

// Geocoding is to convert the name of location to coordinates or vice-versa
// to install npm i @mapbox/mapbox-sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing =await Listing.findById(id)
        .populate({                  // here we are doing populate nesting (if reviews we are also populating author)
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing)
    {
        req.flash("error", "Listing you requested for does not exist");  // here if we try to access a listing that is already deleted by using its id then instead of error this alert will be displayed    
        res.redirect("/Listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res, next) => {

    // This is the code for geocoding
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;      // to store the information of the owner (to link owner with the listing)
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");   // flash message that a new listing is created
    res.redirect("/Listings");
    // console.log(listing);
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Listing you requested for does not exist");  // here if we try to access a listing that is already deleted by using its id then instead of error this alert will be displayed    
        res.redirect("/Listings");
    }

    let originalImageUrl = listing.image.url;  //here we are saving the original image url and then decreasing their quality and then passing it back to edit.ejs
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})

    if(typeof req.file !== "undefined")   // here we are checking that the code in "If" will only run when we will pass an image
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!");   // flash message that the listing is updated
    res.redirect (`/Listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");   // flash message that a listing is deleted
    res.redirect("/Listings");
};

