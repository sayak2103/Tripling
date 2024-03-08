const express=require("express");
const router=express.Router();
const multer=require("multer");
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateListing, isOwner, validateCategory}=require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const {storage}=require("../CloudConfig.js");
const upload=multer({storage});


//index route
router.get("/",wrapAsync(listingControllers.index));


router.route("/new")
//create route -> form render route
    .get(isLoggedIn,listingControllers.newListingFormRender)
//create route -> post new listing , validateListing is called first before the callback works
    .post(
            upload.single("image"),
            validateListing,
            validateCategory,
            wrapAsync(listingControllers.postNewListing));

router.get("/search",wrapAsync(listingControllers.searchListing));

router.route("/:id")
//show route
    .get(wrapAsync(listingControllers.showListing))
//delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing));


router.route("/:id/edit")
//edite route -> form render
    .get(isLoggedIn,isOwner, wrapAsync(listingControllers.editListingformRender))
//edit route -> save changes
    .put(
            isLoggedIn,
            isOwner,
            upload.single("image"),
            validateListing,
            wrapAsync(listingControllers.editListing));


module.exports=router;