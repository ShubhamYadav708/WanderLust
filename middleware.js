const listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,updateListingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to proceed");
        return res.redirect("/login"); 
    }
    next();
};

module.exports.validateUpdateListing = (req, res, next) => {
    const { error } = updateListingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};


module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; 
    }
    return next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listfound = await listing.findById(id);

    if (!listfound) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listfound.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);  

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
