const express = require('express');
const route = express.Router();
const moviesController = require('../controllers/moviesController');


route.post('/',moviesController.addMovies);
route.get('/details',moviesController.getMoviesDetails);
route.get('/',moviesController.getAllMovies);

route.get('/:movieId',moviesController.getMovieDetails);

module.exports = route;

