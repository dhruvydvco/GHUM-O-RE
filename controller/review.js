const Listing=require("../models/listing.js");
const review=require("../models/review.js");


module.exports.createReview=async(req,res)=>{
  
  let listings = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  newReview.author= req.user._id;
  listings.reviews.push(newReview);
  await newReview.save();
  await listings.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listings._id}`);
  // res.send("new review saved");
};


module.exports.destroyReview=async(req,res)=>{

  let {id , reviewId}=req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");

  res.redirect(`/listings/${id}`);
};