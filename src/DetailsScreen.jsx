import { ScrollView, StyleSheet, Text, Image, TouchableOpacity, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { itemId } = route.params; // Get the movie ID from the params
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.27:3000/api/v1/movies/${itemId}`);
        console.log(response.data.data.movieDetails);
        setMovieDetails(response.data.data.movieDetails);
      } catch (error) {
        console.log('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [itemId]);

  const handleViewTrailer = () => {
    if (movieDetails.trailer) {
      Linking.openURL(movieDetails.trailer).catch(err => console.error('An error occurred', err));
    }
  };

  if (!movieDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: movieDetails.poster }} style={styles.poster} />
      <Text style={styles.title}>{movieDetails.movieName}</Text>
      <Text style={styles.detail}>Release Year: {movieDetails.releaseYear}</Text>
      <Text style={styles.detail}>Genre: {movieDetails.genre}</Text>
      <Text style={styles.detail}>Overview: {movieDetails.overView}</Text>
      <Text style={styles.detail}>Avg Rating: {movieDetails.averageRating}</Text>
      <TouchableOpacity style={styles.button} onPress={handleViewTrailer}>
        <Text style={styles.buttonText}>View Trailer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#ff6347', // Tomato color for the button
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieDetailsScreen;
