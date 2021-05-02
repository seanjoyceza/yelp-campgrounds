const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); //select all campgrounds
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => { //remember in this step to parse req.body
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) //this error is passed to catchAsync, which is then passed to next at the bottom
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); //select by id 
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => { //it will be async becuase we need to pre populate the form with what we are editing
    const { id } = req.params;
    const campground = await Campground.findById(id); //select by id 
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //spread operator to give us {title: 'asds', location: 'asds'}
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs); //don't add array but add data from array
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}