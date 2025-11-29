import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
  },
  container: {
    padding: 15,
    alignItems: "center",
    paddingTop: 10,
  },
  loading: {
    marginTop: 50,
    fontSize: 20,
    textAlign: "center",
  },
  recipeCard: {
    width: "90%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 3,
  },
  description: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  ingredient: {
    marginLeft: 12,
    fontSize: 16,
  },
  step: {
    marginLeft: 12,
    fontSize: 16,
    marginBottom: 3,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  remove: {
    marginLeft: 6,
    color: "red",
    fontWeight: "700",
  },
  filterButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default styles;
