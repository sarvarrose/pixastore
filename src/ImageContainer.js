import React from "react";
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

export const ImageContainer = ({ image }) => {
  const { id, previewURL } = image;

  // TODO add handlePress
  const handlePress = (id) => {
    console.log(id);
    Alert.alert("Image Details", `ID: ${id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => handlePress(id)}>
      <View>
        <Image style={styles.image} source={{ uri: previewURL }}></Image>
        <Text style={styles.name}>{id}</Text>
      </View>
    </TouchableOpacity>
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
