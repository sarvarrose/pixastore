import React, { Component } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Alert,
} from "react-native";
import { SearchBar } from "react-native-elements";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    const isPortrait = () => {
      const dim = Dimensions.get("screen");
      return dim.height >= dim.width;
    };

    this.state = {
      data: [],
      page: 1,
      loading: false,
      refreshing: false,
      query: "",
      error: null,
      queryPages: 0,
      orientation: isPortrait() ? "portrait" : "landscape",
      listTopIndex: 0,
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener("change", () => {
      this.setState({
        orientation: isPortrait() ? "portrait" : "landscape",
      });
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    console.log({
      TYPE: "componentDidMount",
      PROPS: this.props,
      STATE: Object.assign({}, this.state, { data: this.state.data.length }),
    });
    this.makeRemoteRequest();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  makeRemoteRequest = () => {
    // This is redirection to search
    const searchQuery = this.props.route.params?.query;
    console.log({
      TYPE: "Before makeRemoteRequest",
      PROPS: this.props,
      STATE: Object.assign({}, this.state, { data: this.state.data.length }),
    });
    this.setState(
      () => {
        return searchQuery && !this.state.query
          ? { data: [], page: 1, query: searchQuery, loading: true }
          : { loading: true };
      },
      () => {
        // console.log({
        //   TYPE: "Before makeRemoteRequest",
        //   PROPS: this.props,
        //   STATE: Object.assign({}, this.state, {data: undefined})
        // });
        let url = `https://pixabay.com/api/?key=23580743-ffaba0b807ad288992a720125&page=${
          this.state.page
        }&q=${this.formatQueryString(this.state.query)}`;
        // console.log(this.state.query);
        fetch(url)
          .then((res) => {
            console.log(res.status); // Will show you the status
            if (!res.ok) {
              throw new Error("HTTP status " + res.status);
            }
            return res.json();
            // return data;
          })
          .then((res) => {
            this.setState(
              {
                // data: this.state.data.concat(
                //   res.hits.filter((item) => this.state.data.indexOf(item) < 0)
                // ),
                data: [...this.state.data, ...res.hits], //TODO make different data and fulldata
                loading: false,
                queryPages: Math.ceil(res.totalHits / 20),

                refreshing: false,
              },
              () => {
                console.log({
                  TYPE: "After makeRemoteRequest",
                  PROPS: this.props,
                  // STATE: this.state.query,
                  OTHER: {
                    dataLength: this.state.data.length,
                    url: url,
                    Orientation: this.state.orientation,
                  },
                });
              }
            );
          })
          .catch((error) => {
            console.log(error);
            this.setState({ error, loading: false });
          });
      }
    );
  };

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
    this.setState(
      {
        page: 1,
        refreshing: true,
        data: [],
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.loading || this.state.page >= this.state.queryPages) return;
    this.setState(
      (state) => ({
        page: state.page + 1,
      }),
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  formatQueryString = (text) => {
    return encodeURIComponent(text.toLowerCase()).replace("%20", "+");
  };

  handleSearch = (query) => {
    this.setState({ query, data: [] }, () => this.makeRemoteRequest());
  };

  handleSearchClear = () => {
    this.props.route.params = null;
    this.setState({ query: "", data: [], page: 1 });
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Images ..."
        round
        onChangeText={this.handleSearch}
        onClear={this.handleSearchClear}
        value={this.state.query}
      />
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            console.log({
              PAGE: "DetailScreen",
              id: item.id,
              name: item.pageURL.substr(27).slice(0, -9),
              index,
            });
            // this.setState({ listTopIndex: index });
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

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator animating size="large" color="#0000ff" />
      </View>
    );
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log(
    //   "Visible items are",
    //   viewableItems.map((item) => {
    //     return { index: item.index, isViewable: item.isViewable };
    //   })
    // );
    // console.log(
    //   "Changed in this iteration",
    //   changed.map((item) => {
    //     return { index: item.index, isViewable: item.isViewable };
    //   })
    // );
    this.setState({ listTopIndex: viewableItems[0].index });
    console.log(viewableItems[0].index);
  };

  handleScrollToIndex = () => {
    setTimeout(() => {
      return {
        animated: true,
        index:
          this.state.listTopIndex / this.state.orientation === "portrait"
            ? 2
            : 4,
        viewPosition: 0,
      };
    }, 500);
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => (item.id + item.user_id).toString()}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !this.state.loading && !this.state.data.length ? (
              <Text>No Images Found</Text>
            ) : null
          }
          // onViewableItemsChanged={this.onViewableItemsChanged}
          // viewabilityConfig={{
          //   itemVisiblePercentThreshold: 80,
          // }}
          // scrollToIndex={this.handleScrollToIndex} // set to scroll to exact item
          key={this.state.orientation === "portrait" ? 2 : 4}
          numColumns={this.state.orientation === "portrait" ? 2 : 4}
          stickyHeaderIndices={[0]}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    width: "auto",
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
});
