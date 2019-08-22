const express = require('express');
const router = express.Router()
var db = require("../../models");

router.get('/favorites', (req, res) => {
    db.place.findAll()
    .then(faves => {
        res.json(faves);
    })
    .catch(err => {
        res.render('404')
    });

})

router.get('/favorites/:id', (req, res) => {
    db.place.findOne({ 
        where: {id: req.params.id}
    })
    .then(place => {
        res.json(place);
    })
    .catch(err => {
        res.render('404')
    });

})



//ENABLE THE ROUTES TO BE USED OUTSIDE OF THIS FILE
module.exports = router