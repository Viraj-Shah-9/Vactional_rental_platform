const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {err} = listingSchema.validate(req.body);
    if(err){
        throw new ExpressError(400, err);
    } else{
        next();
    }
} 


module.exports.validateReview = (req, res, next) => {
    let {err} = reviewSchema.validate(req.body);
    if(err){
        throw new ExpressError(400, err);
    } else{
        next();
    }
}   
