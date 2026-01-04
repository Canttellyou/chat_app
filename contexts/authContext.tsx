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
  useRef,
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasNavigated = useRef(false);

  useEffect(() => {
    loadToken();
  }, []); // Empty array - only run once on mount

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);

        // Check if token has expired
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          console.log("Token expired, clearing...");
          await AsyncStorage.removeItem("token");
          setIsLoading(false);
          goToWelcomePage();
          return;
        }

        // Token is valid - set user state
        setToken(storedToken);
        setUser(decoded.user);
        setCurrentUserId(decoded?.user?.id ?? null);

        // Connect socket
        await connectSocket();

        setIsLoading(false);
        goToHomePage();
      } else {
        // No token found
        setIsLoading(false);
        goToWelcomePage();
      }
    } catch (error) {
      console.error("Failed to decode token: ", error);
      await AsyncStorage.removeItem("token");
      setIsLoading(false);
      goToWelcomePage();
    }
  };

  const goToHomePage = () => {
    if (hasNavigated.current) return; // Prevent multiple navigations
    hasNavigated.current = true;

    setTimeout(() => {
      router.replace("/(main)/home");
      hasNavigated.current = false; // Reset after navigation
    }, 100); // Reduced delay
  };

  const goToWelcomePage = () => {
    if (hasNavigated.current) return; // Prevent multiple navigations
    hasNavigated.current = true;

    setTimeout(() => {
      router.replace("/(auth)/welcome");
      hasNavigated.current = false; // Reset after navigation
    }, 100); // Reduced delay
  };

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);

      // Decode token to get user data
      const decoded = jwtDecode<DecodedTokenProps>(token);
      console.log("decoded token: ", decoded);
      setUser(decoded.user);

      // Set current user ID for notifications
      setCurrentUserId(decoded.user.id ?? null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      await updateToken(response.token);
      await connectSocket();

      // Direct navigation without delay
      hasNavigated.current = true;
      router.replace("/(main)/home");
      setTimeout(() => {
        hasNavigated.current = false;
      }, 1000);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
  ) => {
    try {
      const response = await register(email, password, name, avatar);
      await updateToken(response.token);
      await connectSocket();

      // Direct navigation without delay
      hasNavigated.current = true;
      router.replace("/(main)/home");
      setTimeout(() => {
        hasNavigated.current = false;
      }, 1000);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");

    // Clear current user ID for notifications
    setCurrentUserId(null);

    disconnectSocket();

    hasNavigated.current = true;
    router.replace("/(auth)/welcome");
    setTimeout(() => {
      hasNavigated.current = false;
    }, 1000);
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return null; // Or return a SplashScreen component
  }

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
