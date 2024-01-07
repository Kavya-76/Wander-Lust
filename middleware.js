const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    else
    {
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    else
    {
        next();
    }
};

// we have used this middleware to check if the user is logged into the webside or not.
// .isAuthenticated() function is used to check if the user is logged in or not then only it will be allowed to make changes.
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;  // here we are storing the original url so if we get diverted to the login page then we can get back to the same page and not the home page
        req.flash("error","You must be logged in to make changes");
        return res.redirect("/login");
    }
    next();
};


// the problem is that the passport always resets the req.session so our stored value (req.originalUrl) gets deleted. Therefore we save it to locals so that it can be accessed anywhere
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// we have written this middleware to check if the user trying to edit the listing is the owner of the listing or not.
module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);   
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return  res.redirect(`/Listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);   
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return  res.redirect(`/Listings/${id}`);
    }
    next();
}