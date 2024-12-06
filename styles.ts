import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 30,
    backgroundColor: "#1F1F1F",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#FFF",
    marginRight: 10,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: "#AAA",
    fontSize: 14,
  },
  permissionText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 50,
  },
  nowPlayingBar: {
    padding: 15,
    backgroundColor: "#1F1F1F",
  },
  nowPlayingText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  timeText: {
    color: "#FFF",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
