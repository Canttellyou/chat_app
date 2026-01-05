import { MessageProps } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { AppState, Platform } from "react-native";
import { getSocket } from "./socket";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Track active conversation to prevent notifications when user is viewing it
let activeConversationId: string | null = null;
let currentUserId: string | null = null;
let notificationsEnabled: boolean = true;

export const setActiveConversation = (conversationId: string | null) => {
  activeConversationId = conversationId;
};

// Set the current user ID (call this when user logs in)
export const setCurrentUserId = (userId: string | null) => {
  currentUserId = userId;
  console.log("Current user ID set to:", userId);
};

// Load notification settings
export const loadNotificationSettings = async () => {
  try {
    const value = await AsyncStorage.getItem("notificationsEnabled");
    notificationsEnabled = value !== "false"; // Default to true
    console.log("Notifications enabled:", notificationsEnabled);
  } catch (error) {
    console.error("Error loading notification settings:", error);
  }
};

// Request notification permissions (call this on app startup)
export const requestNotificationPermissions = async () => {
  try {
    // Only request permissions on physical devices
    if (!Device.isDevice) {
      console.log("Must use physical device for push notifications");
      return false;
    }

    // Load notification settings
    await loadNotificationSettings();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("messages", {
        name: "Messages",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permissions denied");
      return false;
    }

    console.log("Notification permissions granted");
    return true;
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

// Show local notification for new message
const showMessageNotification = async (
  message: MessageProps & { conversationId: string }
) => {
  try {
    // Check if notifications are enabled
    if (!notificationsEnabled) {
      console.log("Notifications disabled by user");
      return;
    }

    // Don't show notification if this is the current user's message
    if (message.sender.id === currentUserId) {
      console.log("Skipping notification - message is from current user");
      return;
    }

    // Don't show notification if user is viewing this conversation AND app is active
    const appState = AppState.currentState;
    if (
      appState === "active" &&
      activeConversationId === message.conversationId
    ) {
      console.log("User is in active conversation, skipping notification");
      return;
    }

    console.log("📢 Showing notification for message:", message.id);

    // Use message ID as identifier to prevent duplicates
    const identifier = `msg-${message.id}`;

    // Schedule notification immediately with high priority
    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: identifier,
      content: {
        title: message.sender.name || "New Message",
        body: message.content || "You have a new message",
        data: {
          conversationId: message.conversationId,
          messageId: message.id,
          type: "newMessage",
        },
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        badge: 1,
        ...(Platform.OS === "android" && {
          channelId: "messages",
        }),
      },
      trigger: null, // Show immediately
    });

    console.log("✅ Notification shown with ID:", notificationId);

    // Update badge count
    if (Platform.OS === "ios") {
      const currentBadge = await Notifications.getBadgeCountAsync();
      await Notifications.setBadgeCountAsync(currentBadge + 1);
    }
  } catch (error) {
    console.error("❌ Error showing notification:", error);
  }
};

// Clear badge count when user opens the app
export const clearBadgeCount = async () => {
  try {
    if (Platform.OS === "ios") {
      await Notifications.setBadgeCountAsync(0);
    }
  } catch (error) {
    console.error("Error clearing badge count:", error);
  }
};

// Test notification
export const testNotification = async () => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification!",
        data: { test: true },
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        ...(Platform.OS === "android" && {
          channelId: "messages",
        }),
      },
      trigger: null,
    });
    console.log("Test notification sent with ID:", id);
    return id;
  } catch (error) {
    console.error("Error sending test notification:", error);
  }
};

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("testSocket", payload);
  } else if (typeof payload === "function") {
    socket.on("testSocket", payload);
  } else {
    socket.emit("testSocket", payload);
  }
};

export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("updateProfile", payload);
  } else if (typeof payload === "function") {
    socket.on("updateProfile", payload);
  } else {
    socket.emit("updateProfile", payload);
  }
};

export const getContacts = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("getContacts", payload);
  } else if (typeof payload === "function") {
    socket.on("getContacts", payload);
  } else {
    socket.emit("getContacts", payload);
  }
};

export const newConversation = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("newConversation", payload);
  } else if (typeof payload === "function") {
    socket.on("newConversation", payload);
  } else {
    socket.emit("newConversation", payload);
  }
};

export const getConversations = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("getConversations", payload);
  } else if (typeof payload === "function") {
    socket.on("getConversations", payload);
  } else {
    socket.emit("getConversations", payload);
  }
};

// Track if we've already set up the notification listener
let notificationListenerSetup = false;

export const newMessage = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("newMessage");
    notificationListenerSetup = false;
  } else if (typeof payload === "function") {
    // Remove any existing listeners first to prevent duplicates
    socket.off("newMessage");

    const wrappedCallback = async (data: any) => {
      console.log("📨 New message received via socket", data);

      // Show notification immediately without waiting
      if (data.success && data.data) {
        // Don't await - fire and forget for faster response
        showMessageNotification(data.data).catch((err) => {
          console.error("Error in notification:", err);
        });
      } else {
        console.log("❌ Unexpected data structure:", data);
      }

      // Call the original callback
      payload(data);
    };

    socket.on("newMessage", wrappedCallback);
    notificationListenerSetup = true;
    console.log("✅ New message listener registered");
  } else {
    socket.emit("newMessage", payload);
  }
};

export const getMessages = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("getMessages", payload);
  } else if (typeof payload === "function") {
    socket.on("getMessages", payload);
  } else {
    socket.emit("getMessages", payload);
  }
};
