const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController=require("../controller/review.js");


//Reviews
// POST REVIEW route
router.post("/",isLoggedIn , validateReview, wrapAsync(reviewController.createReview));


// Review
// Delete REVIEW route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;