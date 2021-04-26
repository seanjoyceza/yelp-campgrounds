const express = require('express');
const router = express.Router({ mergeParams: true }); //remember to merge the path 
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body) //this schema was imported from schemas.js file 
    if (error) { //will be thrown to the next down at the bottom 
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review) //recall we structured the form under the key of review (review[body], review[rating] etc.)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

//Review delete route - note the id then reviewId
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//mongo pull operator to pull one review from the array of reviews!
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;