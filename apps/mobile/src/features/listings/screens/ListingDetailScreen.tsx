import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { fetchListing } from "../../../core/api/client";
import { AppText } from "../../../core/components/AppText";
import { Button } from "../../../core/components/Button";
import { Screen } from "../../../core/components/Screen";
import { useSession } from "../../../core/session/SessionContext";
import { colors, radii, spacing } from "../../../core/theme/tokens";
import { formatCurrency } from "../../../core/utils/currency";
import { conditionLabel } from "../../../core/utils/listing";
import type { HomeStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "ListingDetail">;

export function ListingDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { sellerId } = useSession();

  const listingQuery = useQuery({
    queryKey: ["listing", id, sellerId],
    queryFn: () => fetchListing(id, sellerId)
  });

  const listing = listingQuery.data;

  return (
    <Screen
      scroll
      title="Listing"
      headerAccessory={
        <Button label="Close" variant="ghost" onPress={() => navigation.goBack()} style={styles.close} />
      }
    >
      {listingQuery.isLoading ? (
        <AppText variant="subtitle">Loading listing...</AppText>
      ) : null}

      {listingQuery.isError ? (
        <View style={styles.alert}>
          <AppText variant="title">Unable to load listing</AppText>
          <AppText variant="subtitle">It may have sold or the API is unreachable.</AppText>
        </View>
      ) : null}

      {listing ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.pill}>
              <AppText variant="caption" style={styles.pillText}>
                {listing.sport_tag}
              </AppText>
            </View>
            <View style={styles.condition}>
              <AppText variant="caption" style={styles.conditionText}>
                {conditionLabel(listing.condition)}
              </AppText>
            </View>
          </View>
          <AppText variant="price" style={styles.price}>
            {formatCurrency(listing.price)}
          </AppText>
          <AppText variant="title" style={styles.title}>
            {listing.title}
          </AppText>
          <AppText variant="subtitle">{listing.city}</AppText>
          <View style={styles.divider} />
          <AppText variant="body">{listing.description}</AppText>
          <View style={styles.divider} />
          <AppText variant="caption" style={styles.metaCaption}>
            Listing ID
          </AppText>
          <AppText variant="subtitle" style={styles.mono}>
            {listing.id}
          </AppText>
        </View>
      ) : null}

      {listing ? (
        <Button
          label="Message seller"
          onPress={() => {
            /* wired when chat service lands */
          }}
          style={styles.cta}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  close: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm
  },
  alert: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    backgroundColor: colors.surface
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.xl,
    gap: spacing.sm
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.tealMuted,
    borderWidth: 1,
    borderColor: "rgba(63,208,201,0.25)"
  },
  pillText: {
    color: colors.teal,
    textTransform: "none"
  },
  condition: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderStrong
  },
  conditionText: {
    color: colors.accent,
    textTransform: "none"
  },
  price: {
    marginTop: spacing.sm,
    fontSize: 32
  },
  title: {
    marginTop: spacing.sm
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md
  },
  metaCaption: {
    color: colors.textMuted
  },
  mono: {
    fontFamily: "Courier"
  },
  cta: {
    marginTop: spacing.sm
  }
});
