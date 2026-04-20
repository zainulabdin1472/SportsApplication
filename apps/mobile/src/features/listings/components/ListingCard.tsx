import { StyleSheet, Text, View } from "react-native";
import { Listing } from "../../../core/api/client";
import { colors, spacing } from "../../../core/theme/tokens";

type Props = {
  listing: Listing;
};

export function ListingCard({ listing }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.meta}>
        {listing.city} · {listing.condition.replace("_", " ")}
      </Text>
      <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600"
  },
  meta: {
    color: colors.mutedText,
    marginTop: spacing.xs
  },
  price: {
    color: colors.success,
    marginTop: spacing.sm,
    fontWeight: "700",
    fontSize: 18
  }
});
