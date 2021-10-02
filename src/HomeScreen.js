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
import _ from "lodash";
import { SearchBar } from "react-native-elements";
import { PIXA_KEY } from "@env";

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
      query: "",
      page: 1,
      queryPages: 0,
      listTopIndex: 0,
      loading: false,
      refreshing: false,
      error: null,
      orientation: isPortrait() ? "portrait" : "landscape",
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
        if (!res.ok) {
          this.setState({ error: true, loading: false });
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((res) => {
        this.setState({
          data: [...this.state.data, ...res.hits],
          loading: false,
          queryPages: Math.ceil(res.totalHits / 20),

          refreshing: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error, loading: false });
      });
  }, 250);

  makeUrlWithRequest = () => {
    const searchQuery = this.props.route.params?.query;

    this.setState(
      () => {
        return searchQuery && !this.state.query
          ? { data: [], page: 1, query: searchQuery, loading: true }
          : { loading: true };
      },
      () => {
        let url = `https://pixabay.com/api/?key=${PIXA_KEY}&page=${
          this.state.page
        }&q=${this.formatQueryString(this.state.query)}`;

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

  onViewableItemsChanged = ({ viewableItems }) => {
    this.setState({ listTopIndex: viewableItems[0].index });
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
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
          }}
        />
      </SafeAreaView>
    );
  }
}
