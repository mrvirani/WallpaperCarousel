import { StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import Carousel from '../components/Carousel'

const WallpaperScreen = ({route}) => {

  console.log("route.params",route.params);
  
  const { category } = route.params;
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} backgroundColor={'rgba(255,255,255,0.6)'} />
         <Carousel category={category} />
    </View>
  )
}

export default WallpaperScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
      }
})