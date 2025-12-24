import { SplashImage } from "@/assets";
import { colors } from "@/constants/theme";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const SplashScreen = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.replace("/(auth)/welcome");
  //   }, 1500);
  // });
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Animated.Image
        source={SplashImage}
        style={{ width: 200, height: 200 }}
        entering={FadeInDown.duration(700).springify()}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "23%",
    aspectRatio: 1,
  },
});
