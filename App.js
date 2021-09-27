import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet, StatusBar } from "react-native";

import ImageContainer from "./src/ImageContainer";
const apiData = require("./api/data.json");

const App = () => {
  const [data, setData] = useState(apiData.hits);

  useEffect(() => {
    console.log(data.length);
    // TODO get data from api
    // const data = getData();
    // this.setState({ data: data.hits });
  }, []);
  return (
    <SafeAreaView>
      <FlatList
        numColumns={2}
        data={data}
        renderItem={(image) => <ImageContainer image={image} />}
        keyExtractor={(image) => image.id.toString()}
      />
    </SafeAreaView>
  );
};

export default App;
