import Button from "@/components/Button";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  // console.log("user: ", user);

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true);
  //   };
  // }, []);

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("Received data from testSocket event: ", data);
  // };

  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  const conversations = [
    {
      name: "Alice",
      type: "direct",
      lastMessage: {
        senderName: "Alice",
        content: "Hey! Are we still on for tonight?",
        createdAt: "2025-06-22T18:45:00Z",
      },
    },
    {
      name: "Project Team",
      type: "group",
      lastMessage: {
        senderName: "Sarah",
        content: "Meeting rescheduled to 3pm tomorrow.",
        createdAt: "2025-06-21T14:10:00Z",
      },
    },
    {
      name: "Marcus",
      type: "direct",
      lastMessage: {
        senderName: "You",
        content: "Thanks for the help earlier!",
        createdAt: "2025-06-21T09:30:00Z",
      },
    },
    {
      name: "Family Group",
      type: "group",
      lastMessage: {
        senderName: "Mom",
        content: "Don't forget Sunday dinner at 6pm",
        createdAt: "2025-06-20T16:22:00Z",
      },
    },
    {
      name: "Emma",
      type: "direct",
      lastMessage: {
        senderName: "Emma",
        content: "Did you see the latest episode? 😱",
        createdAt: "2025-06-20T21:15:00Z",
      },
    },
    {
      name: "Design Squad",
      type: "group",
      lastMessage: {
        senderName: "Jake",
        content: "New mockups uploaded to Figma",
        createdAt: "2025-06-20T11:45:00Z",
      },
    },
    {
      name: "David",
      type: "direct",
      lastMessage: {
        senderName: "David",
        content: "Can you review my PR when you get a chance?",
        createdAt: "2025-06-19T15:33:00Z",
      },
    },
    {
      name: "Book Club",
      type: "group",
      lastMessage: {
        senderName: "Lisa",
        content: "Next meeting: July 5th, we're reading 'The Midnight Library'",
        createdAt: "2025-06-19T19:00:00Z",
      },
    },
    {
      name: "Rachel",
      type: "direct",
      lastMessage: {
        senderName: "You",
        content: "Sounds good, see you there!",
        createdAt: "2025-06-18T12:20:00Z",
      },
    },
    {
      name: "Weekend Warriors",
      type: "group",
      lastMessage: {
        senderName: "Tom",
        content: "Hiking trip confirmed for Saturday 7am",
        createdAt: "2025-06-18T08:10:00Z",
      },
    },
    {
      name: "Chris",
      type: "direct",
      lastMessage: {
        senderName: "Chris",
        content: "Happy birthday! 🎉🎂",
        createdAt: "2025-06-17T00:05:00Z",
      },
    },
    {
      name: "Dev Team",
      type: "group",
      lastMessage: {
        senderName: "Kevin",
        content: "Production deployment completed successfully",
        createdAt: "2025-06-16T22:30:00Z",
      },
    },
    {
      name: "Olivia",
      type: "direct",
      lastMessage: {
        senderName: "Olivia",
        content: "Just finished the report, sending it over now",
        createdAt: "2025-06-16T17:45:00Z",
      },
    },
    {
      name: "Gym Buddies",
      type: "group",
      lastMessage: {
        senderName: "Mike",
        content: "Who's in for legs day tomorrow?",
        createdAt: "2025-06-16T06:30:00Z",
      },
    },
    {
      name: "Sophie",
      type: "direct",
      lastMessage: {
        senderName: "You",
        content: "Let me know when you're free to chat",
        createdAt: "2025-06-15T14:55:00Z",
      },
    },
    {
      name: "Marketing Team",
      type: "group",
      lastMessage: {
        senderName: "Amanda",
        content: "Q2 results are looking great! 📈",
        createdAt: "2025-06-15T10:20:00Z",
      },
    },
    {
      name: "James",
      type: "direct",
      lastMessage: {
        senderName: "James",
        content: "Got the tickets! Section 105, row 12",
        createdAt: "2025-06-14T20:18:00Z",
      },
    },
    {
      name: "Study Group",
      type: "group",
      lastMessage: {
        senderName: "Nina",
        content: "Exam notes shared in the drive folder",
        createdAt: "2025-06-14T13:40:00Z",
      },
    },
    {
      name: "Alex",
      type: "direct",
      lastMessage: {
        senderName: "Alex",
        content: "Coffee tomorrow morning?",
        createdAt: "2025-06-13T18:05:00Z",
      },
    },
  ];

  let directConversations = conversations
    .filter((item: any) => item.type === "direct")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversations = conversations
    .filter((item: any) => item.type === "group")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,{" "}
              <Typo size={20} color={colors.white} fontWeight={"800"}>
                {currentUser?.name}
              </Typo>
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/profileModal")}
          >
            <Icons.GearSix
              color={colors.white}
              weight="fill"
              size={verticalScale(20)}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[
                    styles.tabStyle,
                    selectedTab === 0 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.tabStyle,
                    selectedTab === 1 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.conversationList}>
              {selectedTab === 0 &&
                directConversations.map((item: any, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversations.length !== index + 1}
                    />
                  );
                })}
              {selectedTab === 1 &&
                groupConversations.map((item: any, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversations.length !== index + 1}
                    />
                  );
                })}
            </View>
            {!loading &&
              selectedTab === 0 &&
              directConversations.length === 0 && (
                <Typo style={{ textAlign: "center" }}>
                  You {"don't"} have any new messages
                </Typo>
              )}
            {!loading &&
              selectedTab === 1 &&
              groupConversations.length === 0 && (
                <Typo style={{ textAlign: "center" }}>
                  You {"haven't"} joined any groups yet
                </Typo>
              )}
            {loading && <Loading />}
          </ScrollView>
        </View>
      </View>
      <Button
        style={styles.floatingButton}
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModal",
            params: { isGroup: selectedTab },
          })
        }
      >
        <Icons.Plus
          color={colors.black}
          weight="bold"
          size={verticalScale(24)}
        />
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
