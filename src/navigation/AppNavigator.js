import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SwiperScreen from '../screen/SwiperScreen';
import WallpaperScreen from '../screen/WallpaperScreen';
import HomeScreen from '../screen/HomeScreen';

const AppNavigator = () => {
  const AppStack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'HomeScreen'}>
        <AppStack.Screen name="HomeScreen" component={HomeScreen} />
        <AppStack.Screen name="WallpaperScreen" component={WallpaperScreen} />
        <AppStack.Screen name="SwiperScreen" component={SwiperScreen} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
