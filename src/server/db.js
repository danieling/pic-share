const mongoose = require('mongoose');

const { database } = require('./keys');

mongoose.connect(database.URI, {
    useNewUrlParser: true
})
    .then(db => console.log('Succesfully connected to DB'))
    .catch(err => console.error(err));