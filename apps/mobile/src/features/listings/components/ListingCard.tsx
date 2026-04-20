import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import type { ListingSummary } from "../../../core/api/schemas";
import { AppText } from "../../../core/components/AppText";
import { colors, radii, shadows, spacing } from "../../../core/theme/tokens";
import { formatCurrency } from "../../../core/utils/currency";
import { conditionLabel } from "../../../core/utils/listing";

type Props = {
  listing: ListingSummary;
  onPress?: () => void;
};

export function ListingCard({ listing, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.accentRail} />
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <AppText variant="caption" style={styles.badgeText}>
            {listing.sport_tag}
          </AppText>
        </View>
        <View style={styles.conditionPill}>
          <AppText variant="caption" style={styles.conditionText}>
            {conditionLabel(listing.condition)}
          </AppText>
        </View>
      </View>
      <AppText variant="title" style={styles.title} numberOfLines={2}>
        {listing.title}
      </AppText>
      <View style={styles.metaRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.textMuted} />
        <AppText variant="subtitle" style={styles.meta}>
          {listing.city}
        </AppText>
      </View>
      <View style={styles.footer}>
        <AppText variant="price">{formatCurrency(listing.price)}</AppText>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    overflow: "hidden",
    ...shadows.card
  },
  pressed: {
    transform: [{ scale: 0.995 }],
    opacity: 0.95
  },
  accentRail: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.tealMuted,
    borderWidth: 1,
    borderColor: "rgba(63,208,201,0.25)"
  },
  badgeText: {
    color: colors.teal,
    textTransform: "none",
    letterSpacing: 0.4
  },
  conditionPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderStrong
  },
  conditionText: {
    color: colors.accent,
    textTransform: "none",
    letterSpacing: 0.4
  },
  title: {
    fontSize: 18,
    marginBottom: spacing.xs
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    marginBottom: spacing.md
  },
  meta: {
    color: colors.textSecondary
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
