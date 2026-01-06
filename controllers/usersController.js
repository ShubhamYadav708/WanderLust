const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const regUser = await User.register(newUser, password);

        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

// SUCCESS handler only (Passport already authenticated user)
module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};
