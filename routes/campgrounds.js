const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body) //this schema was imported from schemas.js file 
    if (error) { //will be thrown to the next down at the bottom 
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//show all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({}); //select all campgrounds
    res.render('campgrounds/index', { campgrounds })
}))

//create route NB --- ORDER DOES MATTER, have this before your show route 
router.get('/new', (req, res) => { //remember in this step to parse req.body
    res.render('campgrounds/new')
})

//create route post request
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) //this error is passed to catchAsync, which is then passed to next at the bottom
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//show single campground 
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews'); //select by id 
    res.render('campgrounds/show', { campground })
}))

//Put/Patch campground GET
router.get('/:id/edit', catchAsync(async (req, res) => { //it will be async becuase we need to pre populate the form with what we are editing
    const campground = await Campground.findById(req.params.id); //select by id 
    res.render('campgrounds/edit', { campground })
}))

//Put/Patch campground PUT
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //spread operator to give us {title: 'asds', location: 'asds'}
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete route
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}))

module.exports = router;