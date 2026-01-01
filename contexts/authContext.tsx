import { login, register } from "@/services/authService";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { setCurrentUserId } from "@/socket/socketEvents";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          // token has expired, navigate to welcome page
          await AsyncStorage.removeItem("token");
          goToWelcomePage();
          return;
        }

        //  user is logged in
        setToken(storedToken);
        await connectSocket();
        setUser(decoded.user);

        // SET CURRENT USER ID FOR NOTIFICATIONS
        setCurrentUserId(decoded?.user?.id ?? null);

        goToHomePage();
      } catch (error) {
        goToWelcomePage();
        console.log("Failed to decode token: ", error);
      }
    } else {
      goToWelcomePage();
    }
  };

  const goToHomePage = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };

  const goToWelcomePage = () => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    });
  };

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);
      // decode token(user)
      const decoded = jwtDecode<DecodedTokenProps>(token);
      console.log("decoded token: ", decoded);
      setUser(decoded.user);

      // SET CURRENT USER ID FOR NOTIFICATIONS
      setCurrentUserId(decoded.user.id ?? null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    await updateToken(response.token);
    await connectSocket();
    router.replace("/(main)/home");
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
  ) => {
    const response = await register(email, password, name, avatar);
    await updateToken(response.token);
    await connectSocket();
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");

    // CLEAR CURRENT USER ID FOR NOTIFICATIONS
    setCurrentUserId(null);

    disconnectSocket();
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
