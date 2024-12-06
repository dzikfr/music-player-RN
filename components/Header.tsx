import React from "react";
import { TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";

const Header = ({ searchQuery, setSearchQuery, onSearch }: any) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, marginTop: 30, backgroundColor: "#1F1F1F" }}>
      <TextInput
        placeholder="Search"
        style={{ flex: 1, backgroundColor: "#333", borderRadius: 20, paddingHorizontal: 15, color: "#FFF", marginRight: 10 }}
        placeholderTextColor="#AAA"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          onSearch(text);
        }}
      />
      <IconButton icon="menu" size={28} />
    </View>
  );
};

export default Header;