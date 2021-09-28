import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
const apiData = require("../api/data.json");

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

const HomeScreen = (props) => {
  return (
    <ScrollView>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {apiData.hits.map((image) => (
          <TouchableOpacity
            key={image.id}
            onPress={() =>
              props.navigation.navigate("DetailScreen", { image: image })
            }
          >
            <Image
              source={{ uri: image.previewURL }}
              style={{
                height: deviceHeight / 4,
                width: deviceWidth / 2 - 4,
                borderRadius: 10,
                margin: 2,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
