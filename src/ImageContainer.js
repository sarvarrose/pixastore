import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const ImageContainer = ({ image }) => {
  const { id, previewURL } = image.item;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: previewURL }}></Image>
      <Text style={styles.name}>{id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    margin: "1%",
    padding: 15,
    borderWidth: 0.75,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  name: { textAlign: "center", fontWeight: "bold" },
});

export default ImageContainer;
