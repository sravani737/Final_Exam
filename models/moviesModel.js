const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const moviesSchema = new Schema({
    movieName:{
        type:String,
        required: true
    },
    releaseYear:{
        type:Number,
        required: true
    },
    poster:{
          type:String,
          required: true
    },
    genre:{
        type:String,
        required: true
    },
    overView:{
        type:String,
        required:true
    },
    averageRating:{
        type:Number,
        required:true
    },
    trailer:{
        type:String,
        required:'true'
    }
},{timestamps: true})

module.exports = mongoose.model('Movies',moviesSchema);