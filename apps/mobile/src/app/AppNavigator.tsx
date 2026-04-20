import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { HomeScreen } from "../features/listings/screens/HomeScreen";
import { Screen } from "../core/components/Screen";

const Tab = createBottomTabNavigator();

function SellScreen() {
  return (
    <Screen title="Sell Gear" subtitle="Create polished listing flow next phase.">
      <Text style={{ color: "#AFC4DF" }}>Seller listing wizard coming next sprint.</Text>
    </Screen>
  );
}

function InboxScreen() {
  return (
    <Screen title="Inbox" subtitle="Real-time buyer-seller chat module.">
      <Text style={{ color: "#AFC4DF" }}>Conversation module scaffold is ready.</Text>
    </Screen>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}
