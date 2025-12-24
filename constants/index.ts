import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "android"
    ? "http://192.168.100.6:3000"
    : "http://localhost:3000";

export const CLOUDINARY_CLOUD_NAME = "duzefg4z8";
export const CLOUDINARY_UPLOAD_PRESET = "images";
