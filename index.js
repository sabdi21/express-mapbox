//require modules
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken: process.env.accessToken})
const methodOverride = require('method-override'); //this allows you to override a method
const ejsLayouts = require('express-ejs-layouts')
const express = require('express');
const app = express()

//MIDDLEWARE AND CONFIG
app.set('view engine', 'ejs')
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method')); //the string allows you to change a post to delete

// bring in api controllers
app.use('/api', require('./controllers/api/api'))


//render the city-search view
app.get('/', (req, res) => {
 res.render('citySearch')
})


//user forward geocoding to search for cities
//RENDER the search result page
app.post('/search', (req, res) => {
//To do:
    //set the query to use the city and state info
    let city = req.body.city;
    let state = req.body.state;
    let query = `${city}, ${state}`;
    //then to forward geocode
    geocodingClient.forwardGeocode({ query })
    .send() //its a promise
    .then(response => {
        const match = response.body.features[0];
        let lat = match.center[1]
        let long = match.center[0];
        let splitPlace_name = match.place_name.split(',')  
        let city = splitPlace_name[0];
        let state = splitPlace_name[1];
        let country = splitPlace_name[2];

        res.render('searchResults', {
            lat,
            long,
            splitPlace_name,
            city,
            state,
            country
        })

    })
})

// add the selected city to our favorites
const db = require('./models')

//ADD the selected city to our favorites
app.post('/favorites', (req, res) => {
    // res.send(req.body)
    db.place.create(req.body)
    .then(result => {
        res.redirect('/favorites')
    })
    .catch(err => {
        if(err) console.log(err) 
        res.send("an error happened while creating a favorite")})
})

//PULL all of the favorite cities, and pass them into the view
app.get('/favorites', (req, res) => {
    db.place.findAll()
    .then(places => {
        res.render('favorites/index', {
            places //this passes everything from our database
        })
    })
    .catch(err => {
        if(err) console.log(err) 
        res.send("an error happened while accessing a favorite")
    })
})

//DELETE the city from the favorites table, and then redirect to the favorites
app.delete('/favorites/:id', (req, res) => {
    db.place.destroy({
        where: { id: req.params.id}
    })
    .then(() => {
        res.redirect('/favorites')
    })
    .catch(err => {
        if(err) console.log(err) 
        res.send("an error happened while delete a favorite")
    })
})

// app.get('/api/favorites', (req, res) => {
//     res.json({
//         key1: "joebob",
//         key2: "example"
//     })
// })

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(3050, () => {
    console.log('You are now listening from port 3050')
})