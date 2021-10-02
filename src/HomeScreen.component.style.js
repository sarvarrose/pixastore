import { StyleSheet } from "react-native";

export default StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  textCenter: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 20,
    fontWeight: "bold",
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
