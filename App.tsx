import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import Header from "./components/Header";
import SongCard from "./components/SongCard";
import { usePermission } from "./hooks/usePermission";
import { useMusic } from "./hooks/useMusic";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { hasPermission, musicFiles, filteredMusicFiles, handleSearch } = useMusic(searchQuery);
  const { getPermission } = usePermission();

  useEffect(() => {
    getPermission();
  }, []);

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#121212" }}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
        
        {hasPermission ? (
          <FlatList
            data={filteredMusicFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SongCard item={item} />}
          />
        ) : (
          <Text style={{ color: "#FFF", textAlign: "center", marginTop: 50 }}>Permission is required to access media</Text>
        )}
      </View>
    </PaperProvider>
  );
};

export default App;