import React from "react";
import { View, Text, Image } from "react-native";
import { IconButton } from "react-native-paper";

const SongCard = ({ item }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        marginHorizontal: 10,
      }}
    >
      <Image
        source={require("../assets/blank-cover.png")}
        style={{ width: 50, height: 50, borderRadius: 5, marginRight: 15 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
          {item.filename ? item.filename.replace(".mp3", "") : "Unknown Title"}
        </Text>
        <Text style={{ color: "#AAA", fontSize: 14 }}>
          {item.artist || "Unknown Artist"}
        </Text>
      </View>
      <IconButton icon="play" size={28} />
    </View>
  );
};

export default SongCard;