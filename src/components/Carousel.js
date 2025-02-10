import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {API_KEY, screenWidth} from '../constants/constants';
import {useNavigation} from '@react-navigation/native';
import NoDataFound from './NoDataFound';

const Carousel = ({category}) => {
  const modalFlatListRef = useRef(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();

  // Fetch wallpaper data
  const fetchWallpapers = async pageNumber => {
    try {
      console.log('Fetching page:', pageNumber);
      const API_URL = `https://api.pexels.com/v1/search?query=${category}&per_page=20`;
      const response = await fetch(
        `${API_URL}&page=${pageNumber}&per_page=10`,
        {
          headers: {Authorization: API_KEY},
        },
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.photos && Array.isArray(data.photos)) {
        setWallpapers(prevWallpapers =>
          pageNumber === 1 ? data.photos : [...prevWallpapers, ...data.photos],
        );
      } else {
        console.warn('Invalid API response:', data);
      }
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchWallpapers(page);
  }, [page]);

  const loadMoreWallpapers = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const openModal = index => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible && modalFlatListRef.current) {
      // Scroll to the correct index when the modal opens
      modalFlatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true, // Set to true for smooth scrolling
      });
    }
  }, [modalVisible, selectedIndex]); // Add selectedIndex to the dependency array

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  if (loading && wallpapers.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const handleImagePress = (item, index) => {
    navigation.navigate('SwiperScreen', {
      image: item, // Selected image
      wallpapers: wallpapers, // Full array of images
      selectedIndex: index, // Index of the selected image
    }); // Pass the image data
  };

  const handleImageLongPress = item => {
    // Open the modal (same logic as before)
    setSelectedIndex(wallpapers.indexOf(item)); // Find the index of the pressed item
    setModalVisible(true);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Main Grid Layout */}
      <FlatList
        data={wallpapers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => handleImagePress(item, index)} 
            onLongPress={() => handleImageLongPress(item)} 
          >
            <Image source={{uri: item.src.portrait}} style={styles.image} />
          </TouchableOpacity>
        )}
        numColumns={2}
        onEndReached={loadMoreWallpapers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="black" />
          ) : null
        }
        ListEmptyComponent={NoDataFound}
        contentContainerStyle={{flexGrow:1}}
      />

      {/* Modal to show full-size image */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {/* Close modal on background tap */}
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={closeModal}
          />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <FlatList
            ref={modalFlatListRef}
            data={wallpapers}
            keyExtractor={item => item.id.toString()}
            horizontal
            getItemLayout={getItemLayout}
            pagingEnabled
            onEndReached={loadMoreWallpapers}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.modalFlatlistContainer}
            renderItem={({item}) => (
              <View style={styles.modalImageContainer}>
                <Image
                  source={{uri: item.src.portrait}}
                  style={styles.fullImage}
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalFlatlistContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: screenWidth,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
