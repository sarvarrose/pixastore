import React from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class DetailScreen extends React.Component {
  render() {
    const { image } = this.props.route.params;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: image.largeImageURL }} //change to largeImageURL from previewURL
          style={styles.imageBackground}
        >
          <TouchableOpacity
            style={styles.backButton}
            key={image.id}
            onPress={() => {
              this.props.navigation.navigate("HomeScreen");
            }}
          >
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{image.user}</Text>
            {image.tags.split(", ").map((tag) => {
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => {
                    this.props.navigation.push("HomeScreen", {
                      query: tag,
                    });
                  }}
                >
                  <Text>#{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  imageBackground: { width: deviceWidth, height: deviceHeight },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
    backgroundColor: "#CED0CE",
    color: "white",
    padding: 10,
    borderRadius: 20,
  },
  textContainer: { alignSelf: "flex-end" },
  text: { marginVertical: 5 },
});

export default DetailScreen;