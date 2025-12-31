import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import MessageItem from "@/components/MessageItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { uploadFileToCloudinary } from "@/services/imageService";
import { getMessages, newMessage } from "@/socket/socketEvents";
import { MessageProps, ResponseProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.5,
    });

    // console.log(result);

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;

    if (!currentUser) return;

    setLoading(true);

    try {
      let attachment = null;
      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachments"
        );

        if (uploadResult.success) {
          attachment = uploadResult.data;
        } else {
          setLoading(false);
          Alert.alert("Error", "Failed to send message");
        }
      }

      newMessage({
        conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        content: message.trim(),
        attachment,
      });

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.log("Error sending message: ", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const dummyMessages = [
  //   {
  //     id: "msg_1",
  //     sender: {
  //       id: "user_1",
  //       name: "John Doe",
  //       avatar: null,
  //     },
  //     content: "Are you planning to add any special features?",
  //     createdAt: "10:40 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_2",
  //     sender: {
  //       id: "user_2",
  //       name: "Sarah Smith",
  //       avatar: null,
  //     },
  //     content: "I think we should focus on the user interface first.",
  //     createdAt: "10:42 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_3",
  //     sender: {
  //       id: "user_3",
  //       name: "Mike Johnson",
  //       avatar: null,
  //     },
  //     content: "Has anyone reviewed the latest design mockups?",
  //     createdAt: "10:45 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_4",
  //     sender: {
  //       id: "user_4",
  //       name: "Emily Chen",
  //       avatar: null,
  //     },
  //     content: "The performance improvements look great!",
  //     createdAt: "10:48 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_5",
  //     sender: {
  //       id: "user_5",
  //       name: "David Brown",
  //       avatar: null,
  //     },
  //     content: "We need to schedule a team meeting soon.",
  //     createdAt: "10:50 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_6",
  //     sender: {
  //       id: "user_6",
  //       name: "Lisa Martinez",
  //       avatar: null,
  //     },
  //     content: "Can someone help me with the authentication module?",
  //     createdAt: "10:53 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_7",
  //     sender: {
  //       id: "user_7",
  //       name: "Tom Wilson",
  //       avatar: null,
  //     },
  //     content: "I'll send over the documentation by end of day.",
  //     createdAt: "10:55 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_8",
  //     sender: {
  //       id: "user_8",
  //       name: "Anna Taylor",
  //       avatar: null,
  //     },
  //     content: "Great work on the API integration!",
  //     createdAt: "10:58 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_9",
  //     sender: {
  //       id: "user_9",
  //       name: "Chris Anderson",
  //       avatar: null,
  //     },
  //     content: "Should we add dark mode support?",
  //     createdAt: "11:00 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_10",
  //     sender: {
  //       id: "user_10",
  //       name: "Rachel Green",
  //       avatar: null,
  //     },
  //     content: "The mobile version needs some bug fixes.",
  //     createdAt: "11:03 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_11",
  //     sender: {
  //       id: "user_11",
  //       name: "Kevin Lee",
  //       avatar: null,
  //     },
  //     content: "I've updated the database schema.",
  //     createdAt: "11:05 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_12",
  //     sender: {
  //       id: "user_12",
  //       name: "Jessica White",
  //       avatar: null,
  //     },
  //     content: "Could you review my pull request?",
  //     createdAt: "11:08 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_13",
  //     sender: {
  //       id: "user_13",
  //       name: "Ryan Hall",
  //       avatar: null,
  //     },
  //     content: "The deployment went smoothly this morning.",
  //     createdAt: "11:10 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_14",
  //     sender: {
  //       id: "user_14",
  //       name: "Michelle Kim",
  //       avatar: null,
  //     },
  //     content: "We should consider adding more test coverage.",
  //     createdAt: "11:13 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_15",
  //     sender: {
  //       id: "user_15",
  //       name: "Brian Clark",
  //       avatar: null,
  //     },
  //     content: "I found a security vulnerability we need to address.",
  //     createdAt: "11:15 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_16",
  //     sender: {
  //       id: "user_16",
  //       name: "Sophia Rodriguez",
  //       avatar: null,
  //     },
  //     content: "The new features are looking amazing!",
  //     createdAt: "11:18 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_17",
  //     sender: {
  //       id: "user_17",
  //       name: "Daniel Moore",
  //       avatar: null,
  //     },
  //     content: "Can we discuss the roadmap for next quarter?",
  //     createdAt: "11:20 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_18",
  //     sender: {
  //       id: "user_18",
  //       name: "Olivia Harris",
  //       avatar: null,
  //     },
  //     content: "I'll be working remotely tomorrow.",
  //     createdAt: "11:23 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_19",
  //     sender: {
  //       id: "user_19",
  //       name: "James Thompson",
  //       avatar: null,
  //     },
  //     content: "The client feedback has been very positive.",
  //     createdAt: "11:25 AM",
  //     isMe: false,
  //   },
  //   {
  //     id: "msg_20",
  //     sender: {
  //       id: "user_20",
  //       name: "Emma Davis",
  //       avatar: null,
  //     },
  //     content: "Let's celebrate the successful launch this week!",
  //     createdAt: "11:28 AM",
  //     isMe: false,
  //   },
  // ];

  const participants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;
  let isDirect = type === "direct";
  const otherParticipant = isDirect
    ? participants.find((p: any) => p.id !== currentUser?.id)
    : null;

  let conversationName = isDirect ? otherParticipant?.name : (name as string);

  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messagesHandler);

    getMessages({ conversationId });

    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messagesHandler, true);
    };
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);
    if (res.success) {
      if (res.data.conversationId === conversationId) {
        setMessages((prev) => [res.data as MessageProps, ...prev]);
      }
    } else {
      Alert.alert("Error", res.msg);
    }
    // console.log("New message received: ", messageData);
  };

  const messagesHandler = (res: ResponseProps) => {
    if (res.success) setMessages(res.data);
  };

  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar
                size={40}
                uri={conversationAvatar as string}
                isGroup={type === "group"}
              />
              <Typo color={colors.white} fontWeight={"500"} size={22}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
              <Icons.DotsThreeOutlineVerticalIcon
                weight="fill"
                color={colors.white}
              />
            </TouchableOpacity>
          }
        />
        {/* Messages */}
        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={true}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
          />
          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 0,
              }}
              placeholder="Type Message"
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.Plus
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(22)}
                  />

                  {selectedFile && selectedFile.uri && (
                    <Image
                      source={selectedFile.uri}
                      style={styles.selectedFile}
                    />
                  )}
                </TouchableOpacity>
              }
            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {loading ? (
                  <Loading size="small" color={colors.black} />
                ) : (
                  <Icons.PaperPlaneTilt
                    color={colors.black}
                    weight="fill"
                    size={verticalScale(22)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingY._15,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
});
