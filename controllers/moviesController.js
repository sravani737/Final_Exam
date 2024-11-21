const moviesSchema = require('../models/moviesModel');


exports.addMovies = async (request, response) => {

    const { movieName, releaseYear, poster, genre, overView, averageRating } = request.body;

    missingFields = [];

    if (!movieName) { missingFields.push("movieName") };
    if (!releaseYear) { missingFields.push("movieating") };
    if (!poster) { missingFields.push('director') };
    if (!genre) { missingFields.push("genre") };
    if (!overView) { missingFields.push("overview") };
    if (!averageRating) { missingFields.push("averageRating") };

    if (missingFields.length > 0) {
        return response.status(400).json({
            status: 'Bad request',
            message: 'requires fields are missing',
            missingFields
        })
    }


    console.log(movieName, releaseYear, poster, genre, overView, averageRating);


    try {
        const newSchema = await moviesSchema.create({
            movieName,
            releaseYear,
            poster,
            genre,
            overView,
            averageRating
        })
        return response.status(201).json({
            status: 'success',
            message: 'schema created',
            data: {
                newSchema
            }
        })
    }
    catch (error) {
        console.error('server error', error.message)
        response.status(500).json({
            status: 'fail',
            message: 'an Error occured from server side',
            error: error.message
        });
    }
}


exports.getAllMovies = async (request, response) => {
    try {
        const allMovies = await moviesSchema.find().select("movieName releaseYear poster");
        return response.status(200).json({
            status: 'success',
            message: 'movies retrieved successfully',
            data: {
                allMovies
            }
        })
    } catch (error) {
        response.status(500).json({
            status: 'fail',
            message: 'An error occurred while fetching movies',
            error: error.message,
        });
    }
}


exports.getMoviesDetails = async (request, response) => {
    try {
        const currentYear = new Date().getFullYear(); 
  
        const allMovies = await moviesSchema
            .find({
                averageRating: { $gt: 8.5 },
                releaseYear:{ $lt:currentYear},
            })
            .select("movieName releaseYear poster averageRating");

        return response.status(200).json({
            status: 'success',
            message: 'Movies retrieved successfully',
            data: {
                allMovies,
            },
        });
    } catch (error) {
        response.status(500).json({
            status: 'fail',
            message: 'An error occurred while fetching movies',
            error: error.message,
        });
    }
};

exports.getMovieDetails = async (request, response) => {
    const { movieId } = request.params;
    console.log(movieId);

    try {
        const movieDetails = await moviesSchema.findById(movieId);
        return response.status(200).json({
            status: 'Success',
            message: 'movie fetched successfully',
            data: {
                movieDetails
            }
        })
    } catch {
        return response.status(500).json({
            status: 'fail',
            message: 'na eerror occured while fetching movie',
            error: error.message
        })
    }
}