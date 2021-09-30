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
} from "react-native";
import { SearchBar } from "react-native-elements";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      loading: false,
      refreshing: false,
      query: "",
      error: null,
      openImage: null,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    // This is redirection to search
    const searchQuery = this.props.route.params?.query;
    console.log("Before Request: ", this.state.query, searchQuery);
    this.setState(
      () => {
        return searchQuery && !this.state.query
          ? { data: [], page: 1, query: searchQuery, loading: true }
          : { loading: true };
      },
      () => {
        let url = `https://pixabay.com/api/?key=23580743-ffaba0b807ad288992a720125&page=${
          this.state.page
        }&q=${this.formatQueryString(this.state.query)}`;
        // console.log(this.state.query);
        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            this.setState({
              data: [...this.state.data, ...res.hits], //TODO make different data and fulldata
              loading: false,
              refreshing: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ error, loading: false });
          });
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
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.loading) return;
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
    this.setState({ query: "", data: [] }, () => this.makeRemoteRequest());
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search ..."
        round
        onChangeText={this.handleSearch}
        // onClear={this.handleSearchClear}
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
            console.log(item.id, index);
            this.setState({ openImage: index });
            this.props.navigation.navigate("DetailScreen", { image: item });
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

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          // scrollToIndex // set to scroll to exact item
          numColumns={2}
          ListEmptyComponent={
            !this.state.loading ? <Text>No Images Found</Text> : null
          }
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

export default HomeScreen;
