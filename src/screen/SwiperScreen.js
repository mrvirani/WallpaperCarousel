import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {API_KEY, API_URL} from '../constants/constants';
import RNFS from 'react-native-fs'; // Importing for download functionality
import Share from 'react-native-share';

const {width, height} = Dimensions.get('window');

const SwiperScreen = ({route}) => {
  const {wallpapers, selectedIndex} = route.params;
  const [cards, setCards] = useState([...wallpapers.slice(selectedIndex)]);
  const [page, setPage] = useState(2);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    cards[0]?.src.portrait || null,
  ); // Track background image
  const animatedScale = new Animated.Value(1);

  // Function to Fetch More Images
  const fetchMoreImages = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    try {
      const response = await fetch(`${API_URL}&page=${page}&per_page=10`, {
        headers: {Authorization: API_KEY},
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.photos && Array.isArray(data.photos)) {
        const newPhotos = data.photos.filter(
          photo => !cards.some(card => card.id === photo.id),
        ); // Remove duplicates
        setCards(prev => [...prev, ...newPhotos]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more images:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleShare = async imageUrl => {
    try {
      // If the image is coming from a URL and you want to download it first:
      const path = `${RNFS.CachesDirectoryPath}/image_${Date.now()}.jpg`;
  
      // Download the image to local storage
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      }).promise;
  
      console.log('Image downloaded to:', path);  // Check download success
  
      // Now share the image
      const shareOptions = {
        title: 'Check out this cool wallpaper!',
        url: `file://${path}`,  // Share the downloaded file path
      };
  
      await Share.open(shareOptions); // Open share options
  
    } catch (error) {
      console.error('Error sharing the image:', error);
    }
  };

  // Download Image Functionality
  const handleDownload = async imageUrl => {
    const path = `${RNFS.DownloadDirectoryPath}/wallpaper_${Date.now()}.jpg`;

    console.log("PATH LOCATION::", path,imageUrl);
    
    try {
      // Check permission if on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission denied');
          return;
        }
      }

      const download = RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      });

      download.promise
        .then(res => {
          console.log('File downloaded to:', path);
          alert('Image downloaded successfully!');
        })
        .catch(error => {
          console.error('Download failed:', error);
          alert('Failed to download the image');
        });
    } catch (error) {
      console.error('Error downloading the image:', error);
      alert('Failed to download the image');
    }
  };

  // Scale Animation for Next Card
  const handleSwipe = index => {
    Animated.timing(animatedScale, {
      toValue: 1.05, // Slightly enlarge next card
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      animatedScale.setValue(1); // Reset scale after animation
    });

    // Update background image dynamically
    if (cards[index + 1]) {
      setCurrentImage(cards[index + 1].src.portrait);
    }

    // Fetch more images when reaching the last 3 cards
    if (index >= cards.length - 3) {
      fetchMoreImages();
    }
  };

  return (
    <ImageBackground
      source={{uri: currentImage}}
      style={styles.background}
      blurRadius={15} // Apply blur effect
    >
      <View style={styles.overlay}>
        {/* Dim background slightly */}
        {cards.length > 0 ? (
          <Swiper
            cards={cards}
            renderCard={(card, index) => (
              <Animated.View
                style={[
                  styles.card,
                  {transform: [{scale: index === 1 ? animatedScale : 1}]},
                ]}>
                <Image source={{uri: card.src.portrait}} style={styles.image} />
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleShare(card.src.portrait)}>
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDownload(card.src.portrait)}>
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            infinite
            backgroundColor={'transparent'} // Make swiper transparent
            cardIndex={0}
            stackSize={3}
            stackScale={10}
            stackSeparation={15}
            onSwiped={index => handleSwipe(index)} // Update background dynamically
            onSwipedRight={index => console.log('Liked:', cards[index]?.id)}
            onSwipedLeft={index => console.log('Disliked:', cards[index]?.id)}
          />
        ) : (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </View>
    </ImageBackground>
  );
};

export default SwiperScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight dimming effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.85,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    position: 'relative', // So buttons are at the bottom of the card
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:10
  },
  button: {
    flex:1,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign:'center'
  },
});
