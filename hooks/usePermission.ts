import { useState } from "react";
import * as MediaLibrary from "expo-media-library";

export const usePermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (error) {
      console.error("Error getting permissions", error);
    }
  };

  return { hasPermission, getPermission };
};