const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {isLoggedIn,validateReview, isReviewOwner}=require("../middleware.js");
const reviewControllers=require("../controllers/review.js");

//route for posting review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.postReview));

//route to delete review from a listing
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewControllers.destroyReview));

module.exports=router;