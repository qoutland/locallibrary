var Genre = require('../models/genre');
var Books = require('../models/book');
var async = require('async');

const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');


exports.genre_list = function(req, res, next) {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(errs, list_genre) {
        if (errs) {return next(errs)}
        res.render('genre_list', {title: 'Genre Instance List', genre_list: list_genre});
    })
};

exports.genre_detail = function(req, res) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: function(callback) {
            Books.find({'genre': req.params.id})
            .exec(callback);
        }
    }, function(err, results) {
        if (err) {return next(err); }
        if (results.genre==null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre-detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

exports.genre_create_get = function(req, res) {
    res.render('genre_form', {title: 'Create Genre'});
};

exports.genre_create_post = [
    body('name', 'Genre name required').isLength({min: 1}).trim(), //Take out any extra whitespace
    sanitizeBody('name').escape(), //Check for any dangerous HTML characters
    (req, res, next) => {
        const errors = validationResult(req);

        var genre = new Genre(
            {name: req.body.name}
        );

        if (!errors.isEmpty()) {
            //Send back errors and form data
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }
        else {
            //Check if genre exists
            Genre.findOne({'name': req.body.name })
            .exec( function(err, found_genre) {
                if (err) {return next(err);}
                if (found_genre) {
                    //Genre already exists redirecting
                    res.redirect(found_genre.url);
                }
                else {
                    //Create the genre and redirect
                    genre.save(function(err) {
                        if (err) {return next(err); }
                        res.redirect(genre.url);
                    });
                }
            });
        }
    }
];

exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};