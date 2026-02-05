import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const Ball = ({color, onDrop, onPick}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  const onGestureEvent = ({nativeEvent}) => {
    translateX.value = nativeEvent.translationX;
    translateY.value = nativeEvent.translationY;
  };

  const onEnd = () => {
    const finalX = translateX.value;
    const finalY = translateY.value;

    translateX.value = withSpring(0);
    translateY.value = withSpring(0);

    if (onDrop) {
      onDrop({x: finalX, y: finalY}); // Pass final position to parent
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onEnded={onEnd}
      onHandlerStateChange={onPick}>
      <Animated.View
        style={[styles.ball, animatedStyle, {backgroundColor: color}]}
      />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical: 5,
  },
});

export default Ball;
