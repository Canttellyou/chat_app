import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { uploadFileToCloudinary } from "@/services/imageService";
import { updateProfile } from "@/socket/socketEvents";
import { UserDataProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileModal = () => {
  const { user, signOut, updateToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const router = useRouter();

  const [userData, setUserData] = useState<UserDataProps>({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar,
  });

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setUserData({ ...userData, avatar: result.assets[0] });
    }
  };

  useEffect(() => {
    updateProfile(processUpdateProfile);
    loadNotificationSetting();

    return () => {
      updateProfile(processUpdateProfile, true);
    };
  }, []);

  const loadNotificationSetting = async () => {
    try {
      const value = await AsyncStorage.getItem("notificationsEnabled");
      if (value !== null) {
        setNotificationsEnabled(value === "true");
      }
    } catch (error) {
      console.log("Error loading notification setting:", error);
    }
  };

  const processUpdateProfile = (res: any) => {
    console.log("got res: ", res);
    setLoading(false);

    if (res.success) {
      updateToken(res.data.token);
      router.back();
    } else {
      Alert.alert("User", res.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar,
    });
  }, [user]);

  const handleLogout = async () => {
    router.back();
    await signOut();
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const navigateToSettings = () => {
    Linking.openSettings();
  };

  const onSubmit = async () => {
    let { name, avatar } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please enter your name");
      return;
    }

    let data = { name, avatar };

    if (avatar && avatar?.uri) {
      setLoading(true);
      const res = await uploadFileToCloudinary(avatar, "profiles");
      console.log("result: ", res);
      if (res.success) {
        data.avatar = res.data;
      } else {
        Alert.alert("User", res.msg || "Failed to upload avatar");
        setLoading(false);
        return;
      }
    }

    // setLoading(true);

    updateProfile(data);
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={
            Platform.OS === "android" && <BackButton color={colors.black} />
          }
          style={{ marginVertical: spacingY._15 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Avatar uri={userData.avatar} size={170} />
            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: spacingY._20 }}>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>
              <Input
                value={userData.email}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  backgroundColor: colors.neutral300,
                }}
                onChangeText={(value) =>
                  setUserData({ ...userData, email: value })
                }
                editable={false}
              />
            </View>
          </View>

          <View style={{ gap: spacingY._20 }}>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>
              <Input
                value={userData.name}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                }}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Typo
              size={18}
              fontWeight="600"
              style={{ paddingLeft: spacingX._10, marginBottom: spacingY._10 }}
            >
              Settings
            </Typo>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={navigateToSettings}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Icons.Gear
                    size={verticalScale(24)}
                    color={colors.primaryDark}
                    weight="fill"
                  />
                </View>
                <View style={styles.settingText}>
                  <Typo fontWeight="600" size={16}>
                    App Settings
                  </Typo>
                  <Typo size={13} color={colors.neutral600}>
                    Manage notifications and permissions
                  </Typo>
                </View>
              </View>
              <Icons.CaretRight
                size={verticalScale(20)}
                color={colors.neutral600}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {!loading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              height: verticalScale(56),
              width: verticalScale(56),
            }}
            onPress={showLogoutAlert}
          >
            <Icons.SignOut
              size={verticalScale(30)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}

        <Button style={{ flex: 1 }} onPress={onSubmit} loading={loading}>
          <Typo fontWeight={"700"}>Update</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral200,
    marginBottom: spacingY._10,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._7,
  },
  settingsSection: {
    gap: spacingY._10,
    marginTop: spacingY._10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
    flex: 1,
  },
  iconContainer: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderRadius: 12,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: {
    flex: 1,
    gap: spacingY._7,
  },
});
