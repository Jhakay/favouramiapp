import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleBooksAPI_Key, rawgAPI_Key, tmdbAPI_Key } from '../../../config.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const placeholderImage = require('../../assets/No-Image-Placeholder.png');

const fetchBooks = async (setBooks) => {
  const query = 'e';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GoogleBooksAPI_Key}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    //console.log(json.items); // Log the items to see what's inside
    setBooks(json.items || []);
  } catch (error) {
    console.error('Error fetching books: ', error);
    setBooks([]);
  }
};

const fetchGames = async (setGames) => { 
  const url = `https://api.rawg.io/api/games?key=${rawgAPI_Key}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    //console.log('Games content: ',json.results); // Log the items to see what's inside
    setGames(json.results || []);
  } catch (error) {
    console.error('Error fetching games: ', error);
    setGames([]);
  }
};

const fetchMovies = async(setMovies) => {
  const query = 'the';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPI_Key}&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    //console.log('Movies API content: ', json.results); //Log to see results
    setMovies(json.results || []);
  } catch (error) {
    console.error('Error fetching movies: ', error);
    setMovies([]);
  }
};

const ProductItem = ({ id, imageUrl, title, description, navigation }) => {

  return (
    <TouchableOpacity style={styles.productItem}
      onPress={() => navigation.navigate('ItemDetails', {
        itemId: id,
        itemTitle: title,
        itemImageUrl: imageUrl,
        itemDescription: description
      })}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : placeholderImage}
        style={styles.productImage}
        resizeMode='contain'
      />
      <Text style={styles.productTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const ShopScreen = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [games, setGames] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchBooks(setBooks);
    fetchGames(setGames);
    fetchMovies(setMovies);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerText}>Digital Favours Store</Text>
      
      <Text style={styles.sectionTitle}>E-Books</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {books.map((book) => (
          <ProductItem 
            key={book.id} 
            imageUrl={book.volumeInfo.imageLinks?.thumbnail}
            title={book.volumeInfo.title}
            description={book.volumeInfo.description}
            navigation={navigation}
          />
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>Games</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {games.map((game) => (
          <ProductItem 
            key={game.id} 
            imageUrl={game.background_image}
            title={game.name} 
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Movies</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie) => (
          <ProductItem 
            key={movie.id} 
            imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.title} 
            description={movie.overview}  // Overview for movies
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  productImage: {
    width: windowWidth * 0.2,
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productItem: {
    width: windowWidth * 0.2,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADD8E6',//'#EFEFEF',
    borderRadius: 15,
    margin: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    //margin: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default ShopScreen;