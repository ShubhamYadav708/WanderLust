const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reveiwController.js");


//post routes
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));


//Review Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;