import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  imageBackground: { width: "100%", height: "100%" },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
    backgroundColor: "#CED0CE",
    color: "white",
    padding: 10,
    borderRadius: 20,
  },
});
