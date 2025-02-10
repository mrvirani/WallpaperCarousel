import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import {API_KEY} from '../constants/constants';
import {useNavigation} from '@react-navigation/native';
import NoDataFound from '../components/NoDataFound';

const API_URL = 'https://api.pexels.com/v1/search?query=wallpapers&per_page=20';

const categories = [
  {id: '1', title: 'Wallpaper', color: '#FF7F7F'}, // Light Red (Warm, Inviting)
  {id: '2', title: '4k Wallpaper', color: '#87CEFA'}, // Light Sky Blue (Calming, Fresh)
  {id: '3', title: '8k Wallpaper', color: '#DDA0DD'}, // Plum (Sophisticated, Elegant)
  {id: '4', title: 'Nature', color: '#3CB371'}, // Medium Sea Green (Fresh, Earthy)
  {id: '5', title: 'Cities', color: '#4682B4'}, // Steel Blue (Modern, Strong)
  {id: '6', title: 'Beach', color: '#00CED1'}, // Dark Turquoise (Vibrant, Cool)
  {id: '7', title: 'Abstract', color: '#C71585'}, // Medium Violet Red (Creative, Bold)
  {id: '8', title: 'Animals', color: '#FFD700'}, // Gold (Energetic, Bright)
  {id: '9', title: 'Flowers', color: '#FF69B4'}, // Hot Pink (Playful, Bright)
  {id: '10', title: 'Fashion', color: '#DA70D6'}, // Orchid (Stylish, Elegant)
  {id: '11', title: 'Cars', color: '#DC143C'}, // Crimson (Bold, Strong)
  {id: '12', title: 'Sports', color: '#32CD32'}, // Lime Green (Energetic, Fresh)
];

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchWallpapers('wallpaper'); // Default images
  }, []);

  const fetchWallpapers = async query => {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=20`,
        {
          headers: {Authorization: API_KEY},
        },
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.photos) setWallpapers(data.photos);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    }
  };

  const handleCategoryPress = category => {
    // navigation.navigate('WallpaperScreen',{ category })
    setSearchQuery(category);
    fetchWallpapers(category);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWallpapers(searchQuery);
    }
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryCard, {backgroundColor: item.color}]}
      onPress={() => handleCategoryPress(item?.title)}>
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderWallpaper = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('WallpaperScreen', {
          category: searchQuery || 'wallpaper',
        })
      }>
      <Image source={{uri: item.src.medium}} style={styles.wallpaperImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={'rgba(255,255,255,0.6)'}
      />
      <Text style={styles.header}>Explore Wallpapers</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search wallpapers..."
          value={searchQuery}
          placeholderTextColor={'gray'}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Categories */}
      <View style={{height: 50}}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginBottom: 10}}
        />
      </View>

      {/* Wallpapers */}
      <FlatList
        data={wallpapers}
        renderItem={renderWallpaper}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.wallpaperRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={NoDataFound}
        contentContainerStyle={{flexGrow:1}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f4f4', padding: 10},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {flexDirection: 'row', marginBottom: 10},
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 3,
  },

  categoryCard: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    minHeight: 40, // Ensures consistent card height
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18, // Ensures text is not cut off
    flexWrap: 'wrap', // Wraps long text if needed
  },

  wallpaperRow: {justifyContent: 'space-between'},
  wallpaperImage: {
    width: width / 2 - 15,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
