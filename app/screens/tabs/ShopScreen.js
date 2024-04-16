import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Shop Coming Soon!</Text>
      {/* You can add more UI elements here as placeholders or teasers for future features */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6', 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
  },
});

export default ShopScreen;
