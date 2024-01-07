const express = require("express");
const router = express.Router({mergeParams: true});
// here merge params means that when we try to add a new review then we require the id of the listing in which the review is to be added
// now here as we removed the common path so the /Listings/:id will not come to review.js and will its scope will remain till app.js
// therefore to get the id in review.js we have set mergeParams: true so that all the parameters will also be shared to review.js
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")

// Review Route
// here in the path we can cut the common part like here it was "/Listings/:id/reviews"
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete review route
// Here we use $pull operator of mongoose that removes from an existing array all instances of a value or values that match a specifed condition.
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;