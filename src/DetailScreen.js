import React from "react";
import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

import ImageDetails from "./ImageDetails";
import styles from "./DetailScreen.component.style";

export default class DetailScreen extends React.Component {
  render() {
    const { image } = this.props.route.params;
    const BackButton = () => {
      return (
        <TouchableOpacity
          style={styles.backButton}
          key={image.id}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      );
    };

    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <View style={styles.container}>
          <ImageBackground
            style={styles.imageBackground}
            source={{ uri: image.largeImageURL }}
          >
            <BackButton />
            <ImageDetails image={image} navigation={this.props.navigation} />
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}
