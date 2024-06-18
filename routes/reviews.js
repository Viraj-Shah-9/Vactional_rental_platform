const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

//create review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview))

//destroy review
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewsController.destroyReview))

module.exports = router;