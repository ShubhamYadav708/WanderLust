const express=require("express");
const router=express.Router();
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const  upload=multer({storage});
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn}=require("../middleware.js");
const{isOwner,validateListing,validateUpdateListing}=require("../middleware.js");

const listingController=require("../controllers/listingsController.js");


router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//update listing
router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateUpdateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;