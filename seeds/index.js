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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Your userID
            author: '6087a60bbdab86a518fa373f',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus est ducimus minima, quia ipsa sequi eos tenetur architecto, dolorum nostrum velit dolore odio non! Corporis explicabo provident alias exercitationem aperiam?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1619937065/YelpCamp/najiqakmuzutnqwuxksi.jpg',
                    filename: 'YelpCamp/najiqakmuzutnqwuxksi'
                },
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1619937066/YelpCamp/akdldtovcuef3trvr8iu.jpg',
                    filename: 'YelpCamp/akdldtovcuef3trvr8iu'
                },
                {
                    url: 'https://res.cloudinary.com/dgvpymhvo/image/upload/v1619937068/YelpCamp/zofoumfsz0kug8d6qghu.jpg',
                    filename: 'YelpCamp/zofoumfsz0kug8d6qghu'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => { //closes the connection after for better quality of life  
    mongoose.connection.close()
});