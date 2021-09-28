import React from "react";
import { Dimensions, ImageBackground, Text, View } from "react-native";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

const DetailScreen = (props) => {
  const { image } = props.route.params;
  console.log(image.largeImageURL);
  return (
    <View style={{ display: "flex" }}>
      <ImageBackground
        source={{ uri: image.largeImageURL }} //change to largeImageURL from previewURL
        style={{ height: deviceHeight, width: deviceWidth }}
      >
        <Text>{image.user}</Text>
        <Text>{image.tags}</Text>
      </ImageBackground>
    </View>
  );
};

export default DetailScreen;
