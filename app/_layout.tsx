import { AuthProvider } from "@/contexts/authContext";
import { requestNotificationPermissions } from "@/socket/socketEvents";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermissions();

      if (granted) {
        console.log("✅ Notifications enabled");
      } else {
        console.log("❌ Notifications disabled");
      }
    };

    setupNotifications();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/profileModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(main)/newConversationModal"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
