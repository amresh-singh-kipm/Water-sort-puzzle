import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Ball from './Ball';

const Container = ({balls, handleDrop, id, onBallPick, registerContainer}) => {
  const [layout, setLayout] = useState(null);

  const onLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setLayout({x, y, width, height});
    registerContainer(id, {x, y, width, height}); // Register container's position with parent
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      {balls.map((color, index) => (
        <Ball
          key={index}
          color={color}
          onDrop={(position) => handleDrop(position, id)} // Pass drop position and source container ID
          onPick={() => onBallPick(id, color)} // Trigger on pick
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '18%',
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default Container;
