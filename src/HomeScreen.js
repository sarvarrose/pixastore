import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { SearchBar } from "react-native-elements";

import styles from "./HomeScreen.component.style";
import {
  fetchImages,
  refreshResults,
  loadMoreResults,
  fetchSearch,
  clearSearch,
  setViewableItems,
} from "./redux";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.props.fetchImages();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    if (!this.props.navigation.canGoBack()) {
      Alert.alert("Exit?", "Are you sure you want to go exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    }
  };

  handleRefresh = () => {
    this.props.refreshResults();
  };

  handleLoadMore = () => {
    this.props.loadMoreResults();
  };

  handleSearch = (query) => {
    this.props.fetchSearch(query);
  };

  handleSearchClear = () => {
    this.props.clearSearch();
  };

  onViewableItemsChanged = ({ viewableItems }) => {
    const viewableItemsIndex = viewableItems[0] ? viewableItems[0].index : 0;
    this.props.setViewableItems(viewableItemsIndex);
  };

  renderEmptyContainer = () => {
    return (
      <Text style={styles.textCenter}>
        {!this.props.loading && !this.props.data.length
          ? "No Images Found"
          : "Loading Images"}
      </Text>
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Images ..."
        round
        onChangeText={this.handleSearch}
        onClear={this.handleSearchClear}
        value={this.props.query}
      />
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            this.props.navigation.push("DetailScreen", { image: item });
          }}
        >
          <Image
            style={styles.imageThumbnail}
            source={{ uri: item.previewURL }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderFooter = () => {
    if (!this.props.data.length) return null;
    return (
      <View style={styles.footerContainer}>
        {!this.props.loading &&
        this.props.pageNumber >= this.props.resultPages ? (
          <Text style={styles.textCenter}>No More Images Found</Text>
        ) : (
          <ActivityIndicator animating size="large" color="#0000ff" />
        )}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <FlatList
          data={this.props.data}
          keyExtractor={(image) => image.id + image.previewURL}
          stickyHeaderIndices={[0]}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={0.5}
          numColumns={2}
          // numColumns={this.props.orientation === "portrait" ? 2 : 4}
          // key={this.props.orientation === "portrait" ? 2 : 4}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmptyContainer}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchImages: () => dispatch(fetchImages()),
    refreshResults: () => dispatch(refreshResults()),
    loadMoreResults: () => dispatch(loadMoreResults()),
    fetchSearch: (query = "") => dispatch(fetchSearch(query)),
    clearSearch: () => dispatch(clearSearch()),
    setViewableItems: (index = 0) => dispatch(setViewableItems(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
