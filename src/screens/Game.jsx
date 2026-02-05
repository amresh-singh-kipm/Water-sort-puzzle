import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const Tube = ({colors, isSelected, targetPosition}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(targetPosition?.x, {duration: 500})},
        {translateY: withTiming(targetPosition?.y, {duration: 500})},
        {rotate: '70deg'},
      ],
    };
  });

  return (
    <Animated.View style={[styles.tube, animatedStyle]}>
      {colors.map((color, index) => (
        <View key={index} style={[styles.water, {backgroundColor: color}]} />
      ))}
    </Animated.View>
  );
};
const {width, height} = Dimensions.get('window');

const GameScreen = () => {
  const [gameState, setGameState] = useState([
    ['red', 'blue', 'green'],
    ['blue', 'green', 'red'],
    ['green', 'red', 'blue'],
    [],
    [],
  ]);

  const [selectedTubeIndex, setSelectedTubeIndex] = useState(null);
  const [targetPosition, setTargetPosition] = useState({x: 0, y: 0});

  const handleTubePress = index => {
    if (selectedTubeIndex === null) {
      // Select the tube to pour from
      setSelectedTubeIndex(index);
    } else {
      // Move the color to the target tube
      const newGameState = [...gameState];
      const selectedTube = newGameState[selectedTubeIndex];
      const targetTube = newGameState[index];

      if (selectedTube.length > 0) {
        const colorToMove = selectedTube[selectedTube.length - 1];

        if (
          targetTube.length === 0 ||
          targetTube[targetTube.length - 1] === colorToMove
        ) {
          // Calculate the target position (center of the target tube, 10px above)
          const tubeWidth = width / gameState.length;
          const targetX = tubeWidth * index + tubeWidth / 2 - 25; // Center of the target tube
          const targetY = height - 150 - 10; // 10px above the target tube
          setTargetPosition({x: targetX, y: targetY});

          // After the animation completes, update the game state
          setTimeout(() => {
            targetTube.push(colorToMove);
            selectedTube.pop();
            setGameState(newGameState);
            setSelectedTubeIndex(null);
            setTargetPosition({x: 0, y: 0}); // Reset the position
          }, 500); // Wait for the animation to complete
        } else {
          // Invalid move, reset selection
          setSelectedTubeIndex(null);
          setTargetPosition({x: 0, y: 0});
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {gameState.map((colors, index) => (
        <TouchableOpacity key={index} onPress={() => handleTubePress(index)}>
          <Tube
            colors={colors}
            isSelected={selectedTubeIndex === index}
            targetPosition={
              selectedTubeIndex === index ? targetPosition : {x: 0, y: 0}
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tube: {
    width: 50,
    height: 150,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  water: {
    width: 46,
    height: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'flex-end',
    padding: 20,
  },
});

export default GameScreen;
