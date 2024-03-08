const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersControlers=require("../controllers/users.js");

router.route("/signUp")
    .get(usersControlers.renderSignUpForm)
    .post(wrapAsync(usersControlers.SignUp));

router.route("/login")
    .get(usersControlers.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate(
            "local",
            {failureRedirect:"/user/login", failureFlash: true}
        ),
        usersControlers.Login
        );

router.get("/logout",usersControlers.LogOut);

module.exports=router;
