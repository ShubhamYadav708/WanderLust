if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRoute = require("./routes/listingRoutes.js");
const reviewRoute = require("./routes/reviewRoutes.js");
const userRoute = require("./routes/userRoutes.js");

const session = require("express-session");
const MongoStore=require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.log("Database connection error:", err));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const mstore=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

mstore.on("error",(err)=>{
    console.log("Error in Mongo session store",err);
});

app.use(session({
    store:mstore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);


app.all("*", (req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { err });
});


app.listen(8080, () => {
    console.log("App is running on port 8080");
});
