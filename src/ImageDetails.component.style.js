import { StyleSheet } from "react-native";

export default StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backgroundColor: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  boldText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: { fontWeight: "normal" },
  tagsContainer: { display: "flex", flexDirection: "row" },
  tag: {
    marginRight: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#007BFF",
    color: "#FFF",
    borderRadius: 10,
  },
});
