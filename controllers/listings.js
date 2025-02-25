const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.filteredListings = async (req, res, next) => {
    let category = req.params.category;
    let allListings = await Listing.find({category : category});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let category = req.body.listing.category;
    console.log(category);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.category = category;
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesn't exist!");
        res.redirect("/listings");
    }

    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs", { listing, originalImgUrl });
}

module.exports.updateListing = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});   
    console.log(listing);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {url, filename};
        await listing.save();        
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect(`/listings`);
}