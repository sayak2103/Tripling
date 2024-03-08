const Listing=require("../models/listing");
const Review=require("../models/review.js");

module.exports.postReview=async(req,res)=>{
    let {review}=req.body;
    let {id}=req.params;
    let listing=await Listing.findById(`${id}`);
    review.author=res.locals.currUser._id;
    let newReview=new Review(review);
    await newReview.save();
    await listing.reviews.push(newReview);
    await listing.save();
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(`${reviewId}`);
    res.redirect(`/listings/${id}`);
}