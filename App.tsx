import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Provider as PaperProvider, IconButton, Card } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [musicFiles, setMusicFiles] = useState<any[]>([]);
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);

  // Request permission for media access
  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error getting permissions', error);
    }
  };

  // Fetch MP3 files from the media library
  const getMusicFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
    const mp3Files = media.assets.filter((asset) => asset.uri.endsWith('.mp3'));
    setMusicFiles(mp3Files);
  };

  // Play music
  const playMusic = async (uri: string, title: string, artist: string) => {
    if (sound) {
      await sound.stopAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
    setSound(newSound);
    setIsPlaying(true);
    setCurrentSong({ uri, title, artist });
  };

  // Toggle play/pause
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

  // Stop music
  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentSong(null);
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

  return (
    <PaperProvider>
      <View style={styles.container}>
        {hasPermission ? (
          <FlatList
            data={musicFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.albumContainer}>
                    <Image source={require('./assets/blank-cover.png')} style={styles.albumCover} />
                  </View>
                  <View style={styles.songInfoContainer}>
                    <Text style={styles.songTitle}>{item.title}</Text>
                    <Text style={styles.artistName}>{item.artist || 'Unknown Artist'}</Text>
                  </View>
                  <IconButton
                    icon={isPlaying && currentSong?.uri === item.uri ? 'pause' : 'play'}
                    size={35}
                    onPress={() => playMusic(item.uri, item.filename, 'Unknown Artist')}
                    style={styles.playPauseButton}
                  />
                </Card.Content>
              </Card>
            )}
          />
        ) : (
          <Text style={styles.permissionText}>Permission is required to access media</Text>
        )}

        {isPlaying && currentSong && (
          <View style={styles.nowPlayingContainer}>
            <Text style={styles.nowPlayingText}>Now Playing: {currentSong.title}</Text>
            <Text style={styles.artistName}>Artist: {currentSong.artist}</Text>
            <View style={styles.controlsContainer}>
              <IconButton
                icon="pause"
                size={50}
                onPress={togglePauseResume}
                style={styles.controlButton}
              />
              <IconButton
                icon="stop"
                size={50}
                onPress={stopMusic}
                style={styles.controlButton}
              />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E', // Dark background for a sleek look
  },
  card: {
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    height: 120,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumContainer: {
    marginRight: 20,
  },
  albumCover: {
    width: 60,
    height: 60,
    backgroundColor: '#555',
    borderRadius: 15,
  },
  songInfoContainer: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: '#AAA',
  },
  playPauseButton: {
    marginLeft: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 50,
  },
  nowPlayingContainer: {
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#222',
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 30,
  },
  nowPlayingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  controlButton: {
    marginHorizontal: 20,
  },
});
