import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

export const useMusic = (searchQuery: string) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [musicFiles, setMusicFiles] = useState<any[]>([]);
  const [filteredMusicFiles, setFilteredMusicFiles] = useState<any[]>([]);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  }, []);

  useEffect(() => {
    const getMusicFiles = async () => {
      if (hasPermission) {
        const media = await MediaLibrary.getAssetsAsync({ mediaType: "audio" });
        const mp3Files = media.assets.filter((asset) => asset.uri.endsWith(".mp3"));
        setMusicFiles(mp3Files);
        setFilteredMusicFiles(mp3Files);
      }
    };
    getMusicFiles();
  }, [hasPermission]);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = musicFiles.filter((file) =>
        file.filename.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMusicFiles(filtered);
    } else {
      setFilteredMusicFiles(musicFiles); 
    }
  };

  return {
    hasPermission,
    musicFiles,
    filteredMusicFiles,
    handleSearch,
  };
};