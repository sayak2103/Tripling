const Listing = require("./models/listing.js");
const {listingSchema, categorySchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        req.flash("error","You are not allowed. Login!");
        res.redirect("/user/login");
    }
    else{
    next();
    }
}

//for post login page
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
}

//to be used as middleware for validating our listingSchema
module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body.listing);
    if(result.error){
        console.log("validate listing middleware error");
        throw (new ExpressError(400,result.error));
    }
    next();
};

// middleware to validate the category of new listing
module.exports.validateCategory=(req,res,next)=>{
    let result=categorySchema.validate(req.body.category);
    if(result.error){
        console.log("validate listing category middleware error");
        throw (new ExpressError(400,result.error));
    }
    next();
}

//middleware for validation of reviews
module.exports.validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        throw (new ExpressError(400,result.error));
    }
    next();
};

//to validate if a listing belongs to the specific user
module.exports.isOwner=wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(`${id}`);
    if(listing.owner.equals(res.locals.currUser._id)){
        next();
    }
    else{
        req.flash("error","You're not the owner of the listing !");
        res.redirect(`/listings/${id}`);
    }
});

//to validate if a review belongs to a user 
module.exports.isReviewOwner=wrapAsync(async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(`${reviewId}`);
    if(review.author.equals(res.locals.currUser._id)){
        next();
    }
    else{
        req.flash("error","Sorry! It was reviewed by someone else.");
        res.redirect(`/listings/${id}`);
    }
})