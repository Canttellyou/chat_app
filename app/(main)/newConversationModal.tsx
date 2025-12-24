import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { uploadFileToCloudinary } from "@/services/imageService";
import { getContacts, newConversation } from "@/socket/socketEvents";
import { verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup === "1";
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [contacts, setContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation);
    getContacts(null);

    return () => {
      getContacts(processGetContacts);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    console.log("got contacts: ", res);
    if (res.success) {
      setContacts(res.data);
    }
  };

  const processNewConversation = (res: any) => {
    // console.log("new conversation result:  ", res);
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: "/(main)/conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      console.log("Error fetching/creating conversation: ", res.msg);
      Alert.alert("Error", res.msg);
    }
  };

  const { user: currentUser } = useAuth();

  const router = useRouter();

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    // console.log(result);

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]);
    }
  };

  const toggleParticipant = (user: any) => {
    setSelectedParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id !== user.id);
      }

      return [...prev, user.id];
    });
  };

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication", "Please login to start a conversation");
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    } else {
      newConversation({
        type: "direct",
        participants: [currentUser.id, user.id],
      });
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser || selectedParticipants.length < 2)
      return;
    setIsLoading(true);
    try {
      if (groupAvatar) {
        let avatar = null;
        if (groupAvatar) {
          const uploadResult = await uploadFileToCloudinary(
            groupAvatar,
            "group-avatars"
          );
          if (uploadResult.success) avatar = uploadResult.data;
        }

        newConversation({
          type: "group",
          participants: [currentUser.id, ...selectedParticipants],
          name: groupName,
          avatar,
        });
      }
    } catch (error: any) {
      console.log("Error creating group: ", error);
      Alert.alert("Error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //   const contacts = [
  //     {
  //       id: "1",
  //       name: "Liam Carter",
  //       avatar: "https://i.pravatar.cc/150?img=11",
  //     },
  //     {
  //       id: "2",
  //       name: "Emma Rodriguez",
  //       avatar: "https://i.pravatar.cc/150?img=45",
  //     },
  //     {
  //       id: "3",
  //       name: "Noah Mitchell",
  //       avatar: "https://i.pravatar.cc/150?img=12",
  //     },
  //     {
  //       id: "4",
  //       name: "Olivia Chen",
  //       avatar: "https://i.pravatar.cc/150?img=32",
  //     },
  //     {
  //       id: "5",
  //       name: "James Anderson",
  //       avatar: "https://i.pravatar.cc/150?img=13",
  //     },
  //     {
  //       id: "6",
  //       name: "Sophia Williams",
  //       avatar: "https://i.pravatar.cc/150?img=47",
  //     },
  //     {
  //       id: "7",
  //       name: "Benjamin Foster",
  //       avatar: "https://i.pravatar.cc/150?img=14",
  //     },
  //     {
  //       id: "8",
  //       name: "Ava Thompson",
  //       avatar: "https://i.pravatar.cc/150?img=33",
  //     },
  //     {
  //       id: "9",
  //       name: "Lucas Martinez",
  //       avatar: "https://i.pravatar.cc/150?img=15",
  //     },
  //     {
  //       id: "10",
  //       name: "Isabella Davis",
  //       avatar: "https://i.pravatar.cc/150?img=44",
  //     },
  //     {
  //       id: "11",
  //       name: "Mason Taylor",
  //       avatar: "https://i.pravatar.cc/150?img=17",
  //     },
  //     {
  //       id: "12",
  //       name: "Mia Johnson",
  //       avatar: "https://i.pravatar.cc/150?img=38",
  //     },
  //     {
  //       id: "13",
  //       name: "Ethan Brown",
  //       avatar: "https://i.pravatar.cc/150?img=18",
  //     },
  //     {
  //       id: "14",
  //       name: "Charlotte Wilson",
  //       avatar: "https://i.pravatar.cc/150?img=43",
  //     },
  //     {
  //       id: "15",
  //       name: "Alexander Lee",
  //       avatar: "https://i.pravatar.cc/150?img=19",
  //     },
  //     {
  //       id: "16",
  //       name: "Amelia Garcia",
  //       avatar: "https://i.pravatar.cc/150?img=41",
  //     },
  //     {
  //       id: "17",
  //       name: "Daniel Moore",
  //       avatar: "https://i.pravatar.cc/150?img=20",
  //     },
  //     {
  //       id: "18",
  //       name: "Harper Jackson",
  //       avatar: "https://i.pravatar.cc/150?img=23",
  //     },
  //     {
  //       id: "19",
  //       name: "Michael White",
  //       avatar: "https://i.pravatar.cc/150?img=52",
  //     },
  //     {
  //       id: "20",
  //       name: "Evelyn Harris",
  //       avatar: "https://i.pravatar.cc/150?img=36",
  //     },
  //   ];

  return (
    <ScreenWrapper isModal>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "New Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        />
        {isGroupMode && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={onPickImage}>
                <Avatar
                  uri={groupAvatar?.uri || null}
                  size={100}
                  isGroup={true}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
        >
          {contacts.map((user: any, index) => {
            const isSelected = selectedParticipants.includes(user.id);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <Avatar size={45} uri={user.avatar} />
                <Typo fontWeight={"500"}>{user.name}</Typo>
                {isGroupMode && (
                  <View style={styles.selectIndicator}>
                    <View
                      style={[styles.checkbox, isSelected && styles.checked]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isGroupMode && selectedParticipants.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
            >
              <Typo fontWeight={"bold"}>Create Group</Typo>
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default NewConversationModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
});
