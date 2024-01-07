if(process.env.NODDE_ENV != "production")
{
    require('dotenv').config();  // it stores the environment variables      // npm i dotenv
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  // it is a tool that applies the same ejs functionality to multiple templates at a same time
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to 80");
    })
    .catch((err) => {
        console.log(err); 
    })

// to establish connection with mongoose database
async function main()
{
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");  // this is our url (we have given database name as wanderlust)
    await mongoose.connect(dbUrl);    //  now our database will be connected to ATLAS (which means that our database will be online and not on our computer)
}

// To set the ejs file 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
// To send the request to server (To form an API)
app.use(express.static(path.join(__dirname, "/public")));   // to use css files

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,          //  in seconds
})

store.on("error", ()=>{
    console.log("Error in MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,          // Here we have given expiry data for 7days in miliseconds
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

// to use passport we require session therefore we are writing it after the session part as user credentials remains same within the same session  (it is used to prevent the user to login at each page of a website)
app.use(passport.initialize());
app.use(passport.session());  // it is used so that the user does not need to sign up at each and every page of the website
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to use flash()
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;   // this is used to store the informatin of the current request. we have used it to access the req in navbar.ejs
    next();
});

// here we have created a demo user to check the p
app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

    let registeredUser = await User.register(fakeUser, "helloworld");   // the second parameter is the password
    res.send(registeredUser);
});

// Show Route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// to validate if the data entered in the listing is correct
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    {
        next();
    }
};

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    {
        next();
    }
};

// The below commented code will work form listing.js in the routes folder
app.use("/Listings", listingRouter);
app.use("/Listings/:id/reviews", reviewRouter);   // here we have to pass that common path 
app.use("/", userRouter);

// // Index Route   
// app.get("/Listings", wrapAsync(async(req, res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs",{allListings});
// }));

// // New Route  - to add a new listing  (we have written the new route above show route as when the request goes for /listings then if show route is above then it starts searching for id)
// app.get("/Listings/new", (req, res) => {
//     res.render("Listings/new.ejs")
// });

// // Show Route
// app.get("/Listings/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing =await Listing.findById(id).populate("reviews");
//     res.render("./listings/show.ejs", {listing});
// }));

// // Create route (to add new listing to database)
// app.post("/Listings",validateListing,wrapAsync(async(req,res, next) => {
//     let newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/Listings");
//     // console.log(listing);
// }));


// // Edit route (to update a listing)
// app.get("/Listings/:id/edit", wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("./Listings/edit.ejs",{listing});
// }));


// // Update Route
// app.put("/Listings/:id",validateListing, wrapAsync(async(req, res) => {
//     if(!req.body.listing){
//         throw new ExpressError(404, "Send valid data for listing");
//     }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect (`/Listings/${id}`);
// }));

// // Delete Route
// app.delete("/Listings/:id", wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/Listings");
// }));

// // Review Route
// app.post("/Listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     // res.send("New review saved");
//     res.redirect(`/Listings/${listing._id}`)
// }));


// // Delete review route
// // Here we use $pull operator of mongoose that removes from an existing array all instances of a value or values that match a specifed condition.
// app.delete("/Listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
//         let {id, reviewId} = req.params;

//         await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//         await Review.findByIdAndDelete(reviewId);

//         res.redirect(`/Listings/${id}`);
//     })
// );


// this will work for all routes it not found above
app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!!!"));
});

// Error handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message="something went wrong"} = err;   // here we have given default values if nothing works than it will be printed
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
})

// To create a connection
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});



// // To acces the listing                     // we will not use it in code as we have are adding information to our database using file "data.js"
// app.get("/testListing", async(req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// })