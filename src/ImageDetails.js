import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import styles from "./ImageDetails.component.style";

export default class ImageDetails extends React.Component {
  render() {
    const { image, navigation } = this.props;

    const Tags = () => {
      return (
        <View style={styles.tagsContainer}>
          {image.tags.split(", ").map((tag) => {
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => {
                  navigation.push("HomeScreen", {
                    query: tag,
                  });
                }}
              >
                <Text style={styles.tag}>#{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    };

    return (
      <View style={styles.textContainer}>
        <View style={styles.backgroundColor}>
          <Text style={styles.boldText}>
            Uploader: <Text style={styles.text}>{image.user}</Text>
          </Text>
          <Text style={styles.boldText}>
            Resolution:{" "}
            <Text style={styles.text}>
              {image.imageWidth} x {image.imageHeight}
            </Text>
          </Text>
          <Tags />
        </View>
      </View>
    );
  }
}
