const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.SignUp=async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        let newUser=new User({username: username,email: email});
        let regUser=await User.register(newUser,password);
        await req.login(regUser,(err)=>{
            if(err){
            return next(err);
            }
        req.flash("success","Welcome to Tripling! Start your first trip now!");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signUp");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.Login=(req,res)=>{
    req.flash("success","Logged in!");
    let redirectUrl=res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);
}

module.exports.LogOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}