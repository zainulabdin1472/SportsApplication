import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreateListingScreen } from "../features/listings/screens/CreateListingScreen";
import { AccountScreen } from "../features/account/screens/AccountScreen";
import { InboxScreen } from "../features/messaging/screens/InboxScreen";
import { colors, spacing } from "../core/theme/tokens";
import { HomeStackNavigator } from "./HomeStack";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: spacing.xs,
          paddingTop: spacing.xs
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2
        }
      }}
    >
      <Tab.Screen
        name="Browse"
        component={HomeStackNavigator}
        options={{
          title: "Browse",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-variant-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Sell"
        component={CreateListingScreen}
        options={{
          title: "Sell",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="tag-plus-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
