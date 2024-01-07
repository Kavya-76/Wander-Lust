const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // res.send("New review saved");
    req.flash("success", "New review added!");   // flash message that a new review is created
    res.redirect(`/Listings/${listing._id}`)
};

module.exports.destroyReview = async (req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");   // flash message that a review is deleted
    res.redirect(`/Listings/${id}`);
};