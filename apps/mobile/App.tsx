import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/app/AppNavigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
