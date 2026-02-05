/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpaTouchableOpacity,
  city,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  isAdjacentSame,
  isContainerCompleted,
  isLevelCompleted,
  retrunCenter,
} from '../helper';
const MAX_HEIGHT = 120;
const AnimatedContainer = ({
  setLevelCompleted,
  containers,
  setContainers,
  saveToHistory,
}) => {
  const [selected, setSelected] = useState(null);
  let containerPosition = {
    2: [
      [-140, 130],
      [-60, 130],
      [20, 130],
      [100, 130],
      [-110, 320],
      [-20, 320],
      [70, 320],
    ],
  };

  let containerss = containers?.levelData.map((a, i) => {
    return {...a, position: containerPosition['2'][i]};
  });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  let rotate = useSharedValue(0);
  let scale = useSharedValue(1);

  const [firstContainerPosition, setFirstContainerPosition] = useState({
    color: '',
    containerNo: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePress = (event, index) => {
    if (isAnimating) return;

    const {pageX, pageY} = event.nativeEvent;
    const {levelData} = containers;

    if (levelData[index].isCompleted) {
      console.log('This container is completed and cannot be selected!');
      return;
    }

    if (selected === index) {
      // If same tube is selected twice, reset animation values
      setSelected(null);
      translateX.value = withTiming(0, {duration: 300});
      translateY.value = withTiming(0, {duration: 300});
      rotate.value = withTiming(0, {duration: 300});
      scale.value = withTiming(1, {duration: 300});
    } else if (selected === null) {
      // First selection
      setSelected(index);
      scale.value = withTiming(1.08, {duration: 300});
    } else {
      // If selecting a different container for pouring
      if (selected !== index && levelData[index].color.length < 4) {
        const source = levelData[selected];
        const target = levelData[index];

        if (
          source.color.length > 0 &&
          (target.color.length === 0 || target.color[0] === source.color[0])
        ) {
          const isRightSide = pageX > 150;
          saveToHistory();
          setFirstContainerPosition({
            color: source.color[0],
            containerNo: index,
          });

          const sourcePos = containerPosition[2][selected];
          const targetPos = containerPosition[2][index];

          // Animate first container moving
          translateX.value = withTiming(
            isRightSide
              ? targetPos[0] - sourcePos[0] - 77
              : targetPos[0] - sourcePos[0] + 77,
            {duration: 500},
          );
          translateY.value = withTiming(targetPos[1] - sourcePos[1] - 90, {
            duration: 500,
          });
          rotate.value = withTiming(isRightSide ? 70 : -70, {duration: 500});
          scale.value = withTiming(1.08, {duration: 500});

          setTimeout(() => {
            setIsAnimating(true);
          }, 500);

          setTimeout(() => {
            // Reset after pouring
            translateX.value = withTiming(0, {duration: 500});
            translateY.value = withTiming(0, {duration: 500});
            rotate.value = withTiming(0, {duration: 500});
            scale.value = withTiming(1, {duration: 500});

            setFirstContainerPosition({color: '', containerNo: ''});
          }, 1000);

          pourLiquid(selected, index);
        } else {
          translateX.value = withTiming(0, {duration: 300});
          translateY.value = withTiming(0, {duration: 300});
          rotate.value = withTiming(0, {duration: 300});
          scale.value = withTiming(1, {duration: 300});
          setTimeout(() => {
            setSelected(index);
            scale.value = withTiming(1.08, {duration: 300});
          }, 300);
          console.log('Invalid move!');
        }
      } else {
        translateX.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(0, {duration: 300});
        rotate.value = withTiming(0, {duration: 300});
        scale.value = withTiming(1, {duration: 300});
        setTimeout(() => {
          setSelected(index);
          scale.value = withTiming(1.08, {duration: 300});
        }, 300);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {rotate: `${rotate.value}deg`}, // Use `deg` for degrees if preferred
        {scale: scale.value},
      ],
    };
  });

  const pourLiquid = (sourceIndex, targetIndex) => {
    const newContainers = {...containers};
    const levelData = [...newContainers.levelData];
    const source = levelData[sourceIndex];
    const target = levelData[targetIndex];

    if (
      source.color.length > 0 &&
      (target.color.length === 0 || target.color[0] === source.color[0])
    ) {
      const count = isAdjacentSame(source.color, target.color);
      const liquidToMove = source.color.slice(0, count);
      const remainingSource = source.color.slice(count);
      const targetAfterPour = [...liquidToMove, ...target.color];

      // Update containers after animation completes
      setTimeout(() => {
        levelData[sourceIndex].color = remainingSource;
        levelData[targetIndex].color = targetAfterPour;
      }, 600);

      // Mark containers as completed
      setTimeout(() => {
        levelData.forEach(container => {
          container.isCompleted = isContainerCompleted(container);
        });
      }, 650);
      newContainers.levelData = levelData;
      setContainers(newContainers);

      // Check if the level is completed
      setTimeout(() => {
        if (isLevelCompleted(levelData)) {
          console.log('Level Completed!');
          containers.isCompleted = true; // Update the state
          setTimeout(() => {
            setLevelCompleted(true);
          }, 1000);
        }
      }, 700);
    } else {
      console.log('Invalid move! to complete');
    }
    setTimeout(() => {
      setSelected(null);
      setIsAnimating(false);
    }, 1600);
  };
  return (
    <View style={styles.wrapper}>
      {containerss?.map((conta, i) => {
        return (
          <View key={i}>
            {i == firstContainerPosition?.containerNo && isAnimating && (
              <View
                style={[
                  styles.colorLine,
                  {
                    backgroundColor: firstContainerPosition?.color,
                    position: 'absolute',
                    top: conta.position[1] - 3,
                    left: conta.position[0] + 25,
                  },
                ]}
              />
            )}
            <TouchableOpacity
              onPress={event => handlePress(event, i)}
              key={i}
              disabled={isAnimating}>
              <Animated.View
                style={[
                  styles.container1,
                  i == selected && animatedStyle,
                  {
                    transform: [{scale: i == selected ? 1.08 : 1}],
                    position: 'absolute',
                    top: conta.position[1],
                    left: conta.position[0],
                    zIndex: i === selected ? 999 : -100, // Make the selected container appear on top
                  },
                ]}>
                {conta?.color.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.liquid,
                      {
                        backgroundColor: color,
                        height: 27,
                        // transform: [
                        //   {rotate: '-30deg'},
                        //   {
                        //     scale:
                        //       index == 0
                        //         ? 1.5
                        //         : index == 1
                        //         ? 1.3
                        //         : index == 2
                        //         ? 1.4
                        //         : index == 3
                        //         ? 1.4
                        //         : 2,
                        //   },
                        // ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default AnimatedContainer;

const styles = StyleSheet.create({
  container1: {
    width: 50,
    height: MAX_HEIGHT + 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  container: {
    // flex: 1,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingHorizontal: 20,
  },
  box: {
    height: 80,
    width: 80,
    margin: 20,
    borderWidth: 1,
    borderColor: '#b58df1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#b58df1',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  liquid: {
    width: '100%',
    overflow: 'hidden',
  },
  colorLine: {
    width: 3,
    height: 155,
    position: 'absolute',
    // top: -10,
    left: '50%',
    transform: [{translateY: -20}], // Center the red line
  },
});
