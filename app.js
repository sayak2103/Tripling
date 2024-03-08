if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

const port=8080;

const DB_URL=process.env.MONGO_ATLAS_LINK;

async function main(){
    await mongoose.connect(DB_URL);
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

const store=MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret:process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600, 
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE...",err);
});

const sessionOptions={
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 24*60*60*1000,
        maxAge: 24*60*60*1000,
        httpOnly: true,
    },
};

const listingsRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/users.js");

app.use(session(sessionOptions));
app.use(flash());// must be after using session and befor the routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware storing flah data(if any) on res.locals 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/user",userRouter);

//for all routes other than the mentioned routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"));
});

//custom error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"}=err;
    res.status(status).render("listings/error.ejs",{err});
});

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
});