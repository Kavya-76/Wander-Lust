// To restructure the listings
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateListing} = require("../middleware.js");  // to used validateListing middleware
const {isLoggedIn} = require("../middleware.js");  // to used isLoggedIn middleware
const {isOwner} = require("../middleware.js");  // to used isOwner middleware
const listingController = require("../controllers/listing.js");
const multer = require("multer");    // multer is used to take the multipart/form-data
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});  // now our files will be stored on cloudinary and therefore we do not need our uploads folder anymore
// const upload = multer({dest: 'uploads/'});  // it will create a folder with the given name and store the file from the form in that folder

// A mpre easy way to define the paths is by using router.route method (by this we can combine the routes haveing the same path)
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")    
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

/*
// Index Route   
router.get("/", wrapAsync(listingController.index));

// New Route  - to add a new listing  (we have written the new route above show route as when the request goes for /listings then if show route is above then it starts searching for id)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route (to add new listing to database)
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));


// Edit route (to update a listing)
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


// Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
*/
module.exports = router;