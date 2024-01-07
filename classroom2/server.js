const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Express session - to install -> npm i express-session
const sessionOptions = {secret: "mysupersecretstring", resave: false, saveUninitialized: true};
app.use(session(sessionOptions));

// connect-flash : The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. 
// npm i connect-flash
app.use(flash());   // to use flash

// middleware to use flash if we do not need to write into the path /hello
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("Success");
    res.locals.errorMsg = req.flash("Error");
    next();
});

app.get("/register", (req, res)=>{
    let {name="Anonymous"} = req.query;
    req.session.name = name;   // we have added a new parameter to the req.session as name
    // console.log(req.session);
    // res.send(name);
    if(name==="Anonymous"){
        req.flash("Error","User not registered");
    }
    
    else{
        req.flash("Success","User registerd successfully!");   // here the message is accessed with the help of key value pairs
    }
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    // res.send(`hello ${req.session.name}`);   // here we can also access the variable name as it is the part of a single route
    // res.render("page.ejs", {name: req.session.name, msg: req.flash("Success")});  // we have created this ejs template to show the flash message.
    
    // better way to use flash  - it is used when we want to pass multiple messages
    // res.locals.successMsg = req.flash("Success");
    // res.locals.errorMsg = req.flash("Error");
    res.render("page.ejs", {name: req.session.name});
});

/*
app.get("/reqcount", (req,res)=>{ 
    if(req.session.count)
    {
        req.session.count++;
    }
    else
    {
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
});
*/

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
});