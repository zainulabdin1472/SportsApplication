import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import type { MainTabParamList } from "../../../navigation/types";
import { AppText } from "../../../core/components/AppText";
import { Button } from "../../../core/components/Button";
import { Screen } from "../../../core/components/Screen";
import { colors, radii, spacing } from "../../../core/theme/tokens";

export function InboxScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <Screen
      scroll
      title="Inbox"
      subtitle="Buyer-seller threads with read receipts and media attachments ship next."
    >
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="message-processing-outline" size={42} color={colors.accent} />
        </View>
        <AppText variant="title">No conversations yet</AppText>
        <AppText variant="subtitle">
          When you message a seller, threads appear here with realtime updates powered by Supabase.
        </AppText>
        <Button label="Browse listings" variant="ghost" onPress={() => navigation.navigate("Browse")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    gap: spacing.md,
    alignItems: "flex-start"
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderStrong
  }
});
