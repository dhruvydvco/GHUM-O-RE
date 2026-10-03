if( process.env.NODE_ENV != "production"){
require('dotenv').config(); 
console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session = require("express-session");
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");


const listingsRouter= require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
 .catch((err)=>{
    console.log(err);
 });

  async function main() {
  await mongoose.connect(MONGO_URL); 
  }

app.set("view engine","ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUnintialised:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  },
};


// app.get("/" , (req,res)=>{
//  res.send("hi i am root"); 
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
  
// });

// let registeredUser= await User.register(fakeUser,"helloworld");
// res.send(registeredUser);
// });

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         image:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("listing succesful");
// })


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


app.all("/{*splat}",(req,res,next)=>{
  next(new ExpressError(404 ,"Page not Found!"));
});


app.use((err,req,res,next)=>{
   let { statusCode = 500, message = "Something went wrong" } = err;

  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});