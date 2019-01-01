const path = require('path');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');


module.exports = app => {
    app.set('port', process.env.PORT || '3000');

    app.set('views', path.join(__dirname, 'views'));
    app.engine('.hbs', exhbs({
        defaultLayout: 'main',
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers')
    }));

    app.set('view engine', '.hbs');

    app.use(morgan('dev'));
    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    return app;
}