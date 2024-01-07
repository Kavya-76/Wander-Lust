const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

        // here we have added a functionality that if the user sign ups then it will automatically get logged in
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Wecome to Wanderlust");
            res.redirect("/Listings");
        });

/*
        req.flash("success", "User registered successfully");
        res.redirect("/Listings");
        res.redirect("/Listings");
*/  
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login = async(req,res)=>{      
    req.flash("success","Welcome back to Wander Lust");
    let redirectUrl = res.locals.redirectUrl || "/Listings";   // here it will check that we are logging in from the home page or some other page (if we are logging in from the home page then ""res.locals.redirectUrl"" will be empty and we will be redirected to ""/Listings"")
    res.redirect(redirectUrl);  // Here we are sending back to the page that we were on 
};


module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are now logged out!");
        res.redirect("/Listings");
    });
};