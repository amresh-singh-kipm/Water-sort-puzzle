import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import WaterSortGame from './src/screens/GameScreen';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';

const Stack = createNativeStackNavigator();
const adUnitId = __DEV__
  ? 'ca-app-pub-8456758478190776/9862810749'
  : 'ca-app-pub-8456758478190776/6356339254';
const adUnitId2 = __DEV__
  ? 'ca-app-pub-8456758478190776/2007240916'
  : 'ca-app-pub-8456758478190776/2007240916';
const App = () => {
  return (
    <NavigationContainer>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Game" component={WaterSortGame} />
      </Stack.Navigator>
      {/* <BannerAd
        unitId={adUnitId2}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      /> */}
    </NavigationContainer>
  );
};

export default App;
