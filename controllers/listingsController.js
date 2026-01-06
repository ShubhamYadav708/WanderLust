const listing = require("../models/listing");

// INDEX
module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

// NEW – render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

// SHOW – show single listing
module.exports.show = async (req, res) => {
    const { id } = req.params;

    const Listing = await listing
        .findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!Listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { Listing });
};

// EDIT – render edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImgUrl = Listing.image?.url;

if (originalImgUrl) {
    originalImgUrl = originalImgUrl.replace(
        "/upload",
        "/upload/e_blur:300/h_200,w_300"
    );
}
    res.render("./listings/edit.ejs", { Listing,originalImgUrl });
};

// CREATE – create new listing
module.exports.createListing = async (req, res) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};

// UPDATE – update listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listfound = await listing.findById(id);
    if (!listfound) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // update text fields (if present)
    if (req.body.listing) {
        await listing.findByIdAndUpdate(id, { ...req.body.listing });
    }

    // update image (if new image uploaded)
    if (req.file) {
        listfound.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listfound.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// DELETE – delete listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const deleted = await listing.findByIdAndDelete(id);
    if (!deleted) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
