const Review=require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.addReview=async (req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success","review created");
    res.redirect(`/listings/${Listing._id}`);
    
};

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted succesfully!!");
    res.redirect(`/listings/${id}`);
};
