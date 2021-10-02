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
  Dimensions,
  Alert,
} from "react-native";
import { SearchBar } from "react-native-elements";
import _ from "lodash";

import styles from "./HomeScreen.component.style";

export default class HomeScreen extends React.Component {
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
    // console.log({
    //   TYPE: "componentDidMount",
    //   PROPS: this.props,
    //   STATE: Object.assign({}, this.state, { data: this.state.data.length }),
    // });
    this.makeUrlWithRequest();
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

  formatQueryString = (text) => {
    return encodeURIComponent(text.toLowerCase()).replace(/%20/g, "+");
  };

  fetchData = _.debounce((url) => {
    console.log(url);
    return fetch(url)
      .then((res) => {
        // console.log(res.status); // Will show you the status
        if (!res.ok) {
          this.setState({ error, loading: false });
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
              // TYPE: "After makeUrlWithRequest",
              // PROPS: this.props,
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
  }, 250);

  makeUrlWithRequest = () => {
    const searchQuery = this.props.route.params?.query;
    // console.log({
    //   TYPE: "Before makeUrlWithRequest",
    //   PROPS: this.props,
    //   STATE: Object.assign({}, this.state, { data: this.state.data.length }),
    // });
    this.setState(
      () => {
        return searchQuery && !this.state.query
          ? { data: [], page: 1, query: searchQuery, loading: true }
          : { loading: true };
      },
      () => {
        // console.log({
        //   TYPE: "Before makeUrlWithRequest",
        //   PROPS: this.props,
        //   STATE: Object.assign({}, this.state, {data: undefined})
        // });
        let url = `https://pixabay.com/api/?key=23580743-ffaba0b807ad288992a720125&page=${
          this.state.page
        }&q=${this.formatQueryString(this.state.query)}`;
        // console.log(this.state.query);

        this.fetchData(url);
      }
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
        data: [],
      },
      () => {
        this.makeUrlWithRequest();
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
        this.makeUrlWithRequest();
      }
    );
  };

  handleSearch = (query) => {
    this.setState({ query, data: [] }, () => this.makeUrlWithRequest());
  };

  handleSearchClear = () => {
    this.props.route.params = null;
    this.setState({ query: "", data: [], page: 1 });
  };

  // TODO remove
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

  renderEmptyContainer = () => {
    return (
      <Text style={styles.textCenter}>
        {!this.state.loading && !this.state.data.length
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
            // console.log({
            //   PAGE: "DetailScreen",
            //   id: item.id,
            //   name: item.pageURL.substr(27).slice(0, -9),
            //   index,
            // });
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

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderFooter = () => {
    if (!this.state.data.length) return null;
    return (
      <View style={styles.footerContainer}>
        {!this.state.loading && this.state.page >= this.state.queryPages ? (
          <Text style={styles.textCenter}>No More Images Found</Text>
        ) : (
          <ActivityIndicator animating size="large" color="#0000ff" />
        )}
      </View>
    );
  };

  // TODO remove
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
    console.log(`Top Item Index: ${viewableItems[0].index}`);
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <FlatList
          data={this.state.data}
          keyExtractor={(item) => (item.id + item.user_id).toString()}
          stickyHeaderIndices={[0]}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={0.5}
          numColumns={2}
          // numColumns={this.state.orientation === "portrait" ? 2 : 4}
          // key={this.state.orientation === "portrait" ? 2 : 4}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmptyContainer}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          // TODO remove
          // onViewableItemsChanged={this.onViewableItemsChanged}
          // viewabilityConfig={{
          //   itemVisiblePercentThreshold: 80,
          // }}
          // scrollToIndex={this.handleScrollToIndex} // set to scroll to exact item
        />
      </SafeAreaView>
    );
  }
}
