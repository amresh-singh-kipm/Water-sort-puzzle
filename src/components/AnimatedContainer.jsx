/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';

import {
  isAdjacentSame,
  isContainerCompleted,
  isLevelCompleted,
} from '../helper';

const MAX_HEIGHT = 120;
const BLOCK_HEIGHT = 27;
const TUBE_WIDTH = 40;

const AnimatedContainer = ({
  setLevelCompleted,
  containers,
  setContainers,
  saveToHistory,
}) => {
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pourMeta, setPourMeta] = useState(null);

  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const streamLength = useSharedValue(0);
  const streamAngle = useSharedValue(0);
  const streamX = useSharedValue(0);
  const streamY = useSharedValue(0);

  const containerPosition = {
    2: [
      [-140, 90],
      [-60, 90],
      [20, 90],
      [100, 90],
      [-110, 290],
      [-20, 290],
      [70, 290],
    ],
  };

  const containersWithPosition = containers?.levelData.map((a, i) => ({
    ...a,
    position: containerPosition['2'][i],
  }));

  // =========================
  // GAME LOGIC
  // =========================
  const performPour = (sourceIndex, targetIndex, moveCount) => {
    const newContainers = { ...containers };
    const levelData = [...newContainers.levelData];

    const source = levelData[sourceIndex];
    const target = levelData[targetIndex];

    const liquidToMove = source.color.slice(0, moveCount);
    const remainingSource = source.color.slice(moveCount);
    const targetAfterPour = [...liquidToMove, ...target.color];

    levelData[sourceIndex].color = remainingSource;
    levelData[targetIndex].color = targetAfterPour;

    levelData.forEach(container => {
      container.isCompleted = isContainerCompleted(container);
    });

    newContainers.levelData = levelData;
    setContainers(newContainers);
  };

  const resetAll = () => {
    progress.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;

    setSelected(null);
    setIsAnimating(false);
    setPourMeta(null);
  };

  const checkLevelComplete = () => {
    if (isLevelCompleted(containers.levelData)) {
      setLevelCompleted(true);
    }
  };

  // =========================
  // POUR ANIMATION
  // =========================
  const [isRightTube, setIsRightTube] = useState(false);
  const startPourAnimation = (
    sourceIndex,
    targetIndex,
    sourcePos,
    targetPos,
  ) => {
    const source = containers.levelData[sourceIndex];
    const target = containers.levelData[targetIndex];

    const moveCount = isAdjacentSame(source.color, target.color);
    const shrinkHeight = moveCount * BLOCK_HEIGHT;

    setIsAnimating(true);
    setPourMeta({
      sourceIndex,
      targetIndex,
      moveCount,
      shrinkHeight,
      color: source.color[0],
    });

    const moveX = targetPos[0] - sourcePos[0];
    const moveY = targetPos[1] - sourcePos[1] - 100;
    const isRight = moveX > 0;
    setIsRightTube(isRight);
    const finalX = isRight ? moveX - 60 : moveX + 60;
    const finalY = moveY;
    const rotateDeg = isRight ? 65 : -65;

    // Calculate stream geometry
    const startX = sourcePos[0] + finalX + (isRight ? TUBE_WIDTH : 0);
    const startY = sourcePos[1] + finalY;
    const endX = targetPos[0] + TUBE_WIDTH / 2;
    const endY = targetPos[1];

    const dx = endX - startX;
    const dy = endY - startY;

    streamLength.value = Math.sqrt(dx * dx + dy * dy);
    streamAngle.value = Math.atan2(dy, dx) * (180 / Math.PI);
    streamX.value = startX;
    streamY.value = startY;

    translateX.value = withTiming(finalX, { duration: 400 });
    translateY.value = withTiming(finalY, { duration: 400 });

    rotate.value = withDelay(
      400,
      withTiming(rotateDeg, { duration: 300 }),
    );

    progress.value = withDelay(
      700,
      withTiming(
        1,
        { duration: 1000, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (finished) {

            // 🔥 UPDATE DATA IMMEDIATELY
            runOnJS(performPour)(
              sourceIndex,
              targetIndex,
              moveCount,
            );

            // Return animation
            rotate.value = withTiming(0, { duration: 300 });
            translateX.value = withTiming(0, { duration: 400 });
            translateY.value = withTiming(
              0,
              { duration: 400 },
              () => {
                runOnJS(resetAll)();
                // Check level completion AFTER all animations are done
                runOnJS(checkLevelComplete)();
              },
            );
          }
        },
      ),
    );
  };

  // =========================
  // TAP HANDLER
  // =========================
  const handlePress = (index) => {
    if (isAnimating) return;

    const { levelData } = containers;
    if (levelData[index].isCompleted) return;

    if (selected === null) {
      setSelected(index);
      scale.value = withSpring(1.08);
      return;
    }

    if (selected === index) {
      resetAll();
      return;
    }

    const source = levelData[selected];
    const target = levelData[index];

    if (
      source.color.length > 0 &&
      target.color.length < 4 &&
      (target.color.length === 0 ||
        target.color[0] === source.color[0])
    ) {
      saveToHistory();

      const sourcePos = containerPosition[2][selected];
      const targetPos = containerPosition[2][index];

      startPourAnimation(selected, index, sourcePos, targetPos);
    } else {
      resetAll();
    }
  };

  // =========================
  // ANIMATED STYLES
  // =========================
  const tubeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));
  console.log("isRightTube", isRightTube)
  const streamStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    // top: streamY.value + 52,
    // left: streamX.value + 40,
    left: isRightTube ? streamX.value + 40 : streamX.value - 48,
    top: isRightTube ? streamY.value + 52 : streamY.value + 175,
    width: 6,
    height: 120,
    transformOrigin: 'top center',
    // transform: ,
    transform: isRightTube ? [{ rotate: `${streamAngle.value - 70}deg` }] : [{ rotate: `${streamAngle.value + 70}deg` }],
    opacity: progress.value,
    zIndex: 99,
  }));

  const sourceShrinkStyle = useAnimatedStyle(() => {
    if (!pourMeta) return {};
    return {
      height: interpolate(progress.value, [0, 1], [0, pourMeta.shrinkHeight]),
    };
  });

  const targetFillStyle = useAnimatedStyle(() => {
    if (!pourMeta) return {};
    return {
      height: interpolate(progress.value, [0, 1], [0, pourMeta.shrinkHeight]),
    };
  });

  // =========================
  // RENDER
  // =========================
  return (
    <View style={styles.wrapper}>
      {containersWithPosition?.map((conta, i) => {
        const isSource = pourMeta?.sourceIndex === i;
        const isTarget = pourMeta?.targetIndex === i;

        return (
          <TouchableOpacity
            key={i}
            disabled={isAnimating}
            onPress={() => handlePress(i)}
            style={{
              position: 'absolute',
              top: conta.position[1],
              left: conta.position[0],
              zIndex: i === selected ? 999 : 1,
            }}
          >
            <Animated.View
              style={[
                styles.container,
                i === selected && tubeStyle,
              ]}
            >
              {conta.color.map((color, idx) => (
                <View
                  key={idx}
                  style={[styles.liquid, { backgroundColor: color }]}
                />
              ))}

              {isSource && (
                <Animated.View
                  style={[styles.topOverlay, sourceShrinkStyle]}
                />
              )}

              {isTarget && (
                <Animated.View
                  style={[
                    styles.bottomFill,
                    { backgroundColor: pourMeta?.color },
                    targetFillStyle,
                  ]}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}

      {isAnimating && pourMeta && (
        <Animated.View
          style={[
            styles.stream,
            { backgroundColor: pourMeta.color },
            streamStyle,
          ]}
        />
      )}
    </View>
  );
};

export default AnimatedContainer;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  container: {
    width: TUBE_WIDTH,
    height: MAX_HEIGHT,
    borderWidth: 2,
    borderColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  liquid: {
    width: '100%',
    height: BLOCK_HEIGHT,
  },

  topOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#111',
  },

  bottomFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  stream: {
    position: 'absolute',
    borderRadius: 3,
  },
});
