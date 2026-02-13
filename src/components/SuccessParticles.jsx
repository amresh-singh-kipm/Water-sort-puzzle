import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const Particle = ({color, delay, onComplete}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Wider random horizontal drift
    const randomX = (Math.random() - 0.5) * 150; // Increased from 100 to 150
    const randomRotation = (Math.random() - 0.5) * 720; // Random spin
    
    // Shoot up then fall
    translateY.value = withDelay(
      delay,
      withTiming(-250, { // Increased height
        duration: 2000, // 2 seconds
        easing: Easing.out(Easing.cubic),
      }),
    );
    
    translateX.value = withDelay(
      delay,
      withTiming(randomX, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
    );
    
    // Add rotation for more dynamic effect
    rotate.value = withDelay(
      delay,
      withTiming(randomRotation, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
    );
    
    opacity.value = withDelay(
      delay,
      withTiming(0, {
        duration: 2000,
        easing: Easing.in(Easing.ease),
      }, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }),
    );
    
    scale.value = withDelay(
      delay,
      withTiming(0.3, { // Shrink more gradually
        duration: 2000,
        easing: Easing.in(Easing.ease),
      }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: translateY.value},
        {translateX: translateX.value},
        {rotate: `${rotate.value}deg`},
        {scale: scale.value},
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          shadowColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const SuccessParticles = ({color, position, onComplete}) => {
  // More particles for more impact
  const particles = Array.from({length: 18}, (_, i) => ({
    id: i,
    delay: i * 40, // Slightly longer stagger
  }));

  return (
    <View
      style={[
        styles.container,
        {
          left: position.left,
          top: position.top,
        },
      ]}>
      {particles.map((p, index) => (
        <Particle
          key={p.id}
          color={color}
          delay={p.delay}
          onComplete={index === particles.length - 1 ? onComplete : null}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    width: 12, // Increased from 8px
    height: 12, // Increased from 8px
    borderRadius: 6, // Half of width/height
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9, // Brighter glow
    shadowRadius: 6, // Larger glow
  },
});

export default SuccessParticles;
