import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default HomeScreen = () => {
  const [movieList, setMovieList] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch movies from the API
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://192.168.1.27:3000/api/v1/movies/details');
        const response1 = await axios.get('http://192.168.1.27:3000/api/v1/movies/');

        // Populate the movieList with the appropriate data
        setMovieList(response.data.data.allMovies);  // These are the movies you want to show as 'Popular Movies'
        
        // Set allMovies for search filtering
        setAllMovies(response1.data.data.allMovies);  // This is the list used for search purposes
        
        setLoading(false);
      } catch (error) {
        console.log('Error occurred:', error.response || error.message);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies based on the search query
  const filteredMovies = allMovies.filter((movie) =>
    movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render a single movie item
  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() => navigation.navigate('Details', { itemId: item._id })}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.textContainer}>
        <Text style={styles.movieTitle}>{item.movieName}</Text>
        <Text style={styles.releaseYear}>Year: {item.releaseYear}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to My Movies App</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Conditionally Render Movies */}
      {searchQuery ? (
        // Show filtered movies if there's a search query
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        // Show movieList when there's no search query
        <>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Popular Movies</Text>
          </View>
          <FlatList
            data={movieList}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'green',
    marginBottom: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  sectionTitleContainer: {
    marginBottom: 10,
    paddingLeft: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6347', // Tomato color for section title
    textAlign: 'left',
  },
  listContainer: {
    paddingBottom: 20,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  releaseYear: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
