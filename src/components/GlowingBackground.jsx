import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const Star = ({size, delay, duration}) => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    scale.value = withRepeat(
      withTiming(1.5, {
        duration: duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const GlowingOrb = ({left, top, color, size}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-50, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.8, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.6,
          shadowRadius: 50,
        },
        animatedStyle,
      ]}
    />
  );
};

const GlowingBackground = ({children}) => {
  // Generate random star positions - reduced count for performance
  const stars = Array.from({length: 30}, (_, i) => ({
    id: i,
    left: Math.random() * width,
    top: Math.random() * height,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 3000 + 2000,
  }));

  return (
    <View style={styles.container}>
      {/* Cosmic Gradient Background */}
      <LinearGradient
        colors={[
          '#0a0e27',
          '#1a1b4b',
          '#2d1b69',
          '#3d2080',
          '#1a1b4b',
          '#0a0e27',
        ]}
        locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        style={styles.gradient}
      />

      {/* Nebula Effect Overlays - simplified for performance */}
      <View style={styles.nebulaContainer}>
        <View style={[styles.nebula, styles.nebula1]} />
        <View style={[styles.nebula, styles.nebula2]} />
      </View>

      {/* Stars */}
      <View style={styles.starsContainer}>
        {stars.map(star => (
          <View
            key={star.id}
            style={{
              position: 'absolute',
              left: star.left,
              top: star.top,
            }}>
            <Star size={star.size} duration={star.duration} />
          </View>
        ))}
      </View>

      {/* Glowing Orbs - reduced for performance */}
      <GlowingOrb left={50} top={200} color="#00d4ff" size={120} />
      <GlowingOrb left={width - 100} top={height - 250} color="#ff00ff" size={100} />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  nebulaContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  nebula: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  nebula1: {
    width: 350,
    height: 350,
    backgroundColor: '#ff00ff',
    top: -100,
    right: -100,
    shadowColor: '#ff00ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 80,
  },
  nebula2: {
    width: 300,
    height: 300,
    backgroundColor: '#00d4ff',
    bottom: -100,
    left: -100,
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 80,
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  orb: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});

export default GlowingBackground;
