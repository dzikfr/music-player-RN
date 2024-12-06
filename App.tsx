import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { Provider as PaperProvider, IconButton } from "react-native-paper";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [musicFiles, setMusicFiles] = useState<any[]>([]);
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [filteredMusicFiles, setFilteredMusicFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (error) {
      console.error("Error getting permissions", error);
    }
  };

  const getMusicFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: "audio" });
    const mp3Files = media.assets.filter((asset) => asset.uri.endsWith(".mp3"));
    setMusicFiles(mp3Files);
    setFilteredMusicFiles(mp3Files);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = musicFiles.filter((file) =>
        file.filename.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMusicFiles(filtered);
    } else {
      setFilteredMusicFiles(musicFiles); 
    }
  };

  const playMusic = async (uri: string, title: string) => {
    if (sound) {
      await sound.unloadAsync(); 
    }
    try {
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        updatePosition
      );

      if (status.isLoaded) {
        setSound(newSound);
        setDuration(status.durationMillis || 0);
        setIsPlaying(true);
        setCurrentSong({ uri, title });
      } else {
        console.error("Sound status not loaded");
      }

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (
          status.isLoaded &&
          status.positionMillis === status.durationMillis
        ) {
          // Cari lagu berikutnya dan putar
          const currentIndex = musicFiles.findIndex((file) => file.uri === uri);
          const nextSong = musicFiles[currentIndex + 1] || musicFiles[0];
          playMusic(nextSong.uri, nextSong.filename);
        }
      });
    } catch (error) {
      console.error("Error playing music:", error);
    }
  };

  const togglePauseResume = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true); 
      }
    }
  };

  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const updatePosition = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
      }
    }
  };

  const seek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      getMusicFiles();
    }
  }, [hasPermission]);

  useEffect(() => {
    const interval = setInterval(updatePosition, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const formatTime = (timeMillis: number) => {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = Math.floor((timeMillis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <IconButton icon="menu" size={28} />
        </View>

        {hasPermission ? (
          <FlatList
            data={filteredMusicFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.songCard}>
                <Image
                  source={require("./assets/blank-cover.png")}
                  style={styles.albumCover}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>
                    {item.filename
                      ? item.filename.replace(".mp3", "")
                      : "Unknown Title"}
                  </Text>
                  <Text style={styles.artistName}>
                    {item.artist || "Unknown Artist"}
                  </Text>
                </View>
                <IconButton
                  icon={
                    isPlaying && currentSong?.uri === item.uri
                      ? "pause"
                      : "play"
                  }
                  size={28}
                  onPress={() => playMusic(item.uri, item.filename)}
                />
              </View>
            )}
          />
        ) : (
          <Text style={styles.permissionText}>
            Permission is required to access media
          </Text>
        )}

        {isPlaying && currentSong && (
          <View style={styles.nowPlayingBar}>
            <Text style={styles.nowPlayingText}>{currentSong.title.replace(".mp3", "")}</Text>
            <Slider
              style={styles.progressBar}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={seek}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#666"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.controlsContainer}>
              <IconButton
                icon={isPlaying ? "pause" : "play"}
                size={28}
                onPress={togglePauseResume}
              />
              <IconButton icon="stop" size={28} onPress={stopMusic} />
            </View>
          </View>
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
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
