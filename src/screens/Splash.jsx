/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import splashImage from '../assets/images/splash.png';

const Splash = ({navigation}) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      navigation.replace('Game');
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.splash}>
      <Image
        source={splashImage}
        width={'100%'}
        height={'100%'}
        resizeMode="cover"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121322',
  },
});
