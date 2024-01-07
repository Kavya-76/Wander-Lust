const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

// to parse the cookies we install -> npm i cookie-parser
app.use(cookieParser());


// signed cookie - it is a cookie that cannot be tempared or changed by the user
app.use(cookieParser("secretcode"));
app.get("/getsignedcookie", (req,res)=>{
    res.cookie("made in","India", {signed: true});
    res.send("signed cookie sent");
})

// to verify the signed cookie
app.get("/verify", (req,res)=>{
    console.log(req.cookies);  // it only prints unsigned cookies
    console.log(req.signedCookies);  // it will print the signed cookies
    res.send("verified");
})


// you can check the cookie in console > application
app.get("/getcookies", (req,res)=>{
    res.cookie("Greet", "hello");  // here we are sending a cookie. It is always sent in a key value pair
    res.cookie("Made in ", "India");
    res.send("Sent you some cookies");
})

app.get("/greet", (req,res)=>{
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi ${name}`);
})

app.get("/", (req,res) =>{
    console.dir(req.cookies);   // we cannot directly access the cookie in other path so we need to use cookie parser
    res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/posts",posts);


app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
});