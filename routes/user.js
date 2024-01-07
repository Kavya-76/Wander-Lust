const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.Login);

router.get("/logout", userController.logout);

/*
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.renderLoginForm);

// passcode.authenticate is used to check if the user exists in database or not
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.Login);

router.get("/logout", userController.logout);
*/
module.exports = router;