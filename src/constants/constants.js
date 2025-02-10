import { Dimensions } from "react-native";


export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height
export const API_KEY = "NxOJoYvbZWzQL4TK62oluhH7IXATgEBgqJSgvqksgPyU2WHbkgYautEv";
export const API_URL = "https://api.pexels.com/v1/search?query=wallpaper&per_page=20";

export const cardWidth = screenWidth - 60
export const cardHeight =  screenHeight - 200
export const space = 10;
export const radius = 10;