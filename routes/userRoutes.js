const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

const userController=require("../controllers/usersController");

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signupUser));

router.route("/login")
.get(userController.loginForm)
.post(
    saveRedirect,
    passport.authenticate("local",
    {failureRedirect:'/login',
    failureFlash:true}),userController.loginUser
);

router.get("/logout",userController.logoutUser);

module.exports=router;