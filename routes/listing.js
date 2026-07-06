
// const express = require("express");
// const router = express.Router();

// const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Listing = require('../models/listing.js');


// // ✅ Fixed validation middleware
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// // Index Route
// router.get("/", wrapAsync(async (req, res) => {
//     const listings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings: listings });
// }));

// // New listing form
// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // Create listing
// router.post("/", wrapAsync(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// // Show listing
// router.get("/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id).populate('reviews');
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }
//     res.render("listings/show.ejs", { listing });
// }));

// // Edit form
// router.get("/:id/edit", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }
//     res.render("listings/edit.ejs", { listing });
// }));

// // Update listing
// router.put("/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
//     await updatedListing.save();
//     res.redirect(`/listings/${id}`);
// }));

// // Delete listing
// router.delete("/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));

// module.exports = router;

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');



const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { allListings: listings });
}));

// New listing form
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Show listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
}));

// Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
