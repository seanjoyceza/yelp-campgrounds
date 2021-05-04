const mongoose = require('mongoose');
const cities = require('./cities') //remember to import the seed files
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected')
})

const sample = (array) => {//picks a random array input
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => { //just a function that deletes the whole DB 
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Your userID
            author: '6087a60bbdab86a518fa373f',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random100].city}, ${cities[random100].admin_name}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus est ducimus minima, quia ipsa sequi eos tenetur architecto, dolorum nostrum velit dolore odio non! Corporis explicabo provident alias exercitationem aperiam?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random100].lng,
                    cities[random100].lat
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1620155139/YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_qpqsth.jpg',
                    filename: 'YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_qpqsth'
                },
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1620155140/YelpCamp/tom-king-ab5cYksljk0-unsplash_uw0yzo.jpg',
                    filename: 'YelpCamp/tom-king-ab5cYksljk0-unsplash_uw0yzo'
                },
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1620155149/YelpCamp/kyle-glenn-yGYL1AQjcZU-unsplash_ayksqs.jpg',
                    filename: 'YelpCamp/kyle-glenn-yGYL1AQjcZU-unsplash_ayksqs'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => { //closes the connection after for better quality of life  
    mongoose.connection.close()
});