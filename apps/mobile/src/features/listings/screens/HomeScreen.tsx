import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchListings } from "../../../core/api/client";
import { Screen } from "../../../core/components/Screen";
import { colors, spacing } from "../../../core/theme/tokens";
import { ListingCard } from "../components/ListingCard";

export function HomeScreen() {
  const listingsQuery = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings
  });

  return (
    <Screen
      title="Sports Marketplace"
      subtitle="Buy and sell pre-owned and new sports gear."
    >
      {listingsQuery.isLoading ? (
        <Text style={styles.label}>Loading fresh listings...</Text>
      ) : null}

      {listingsQuery.isError ? (
        <View style={styles.alert}>
          <Text style={styles.label}>Unable to fetch listings right now.</Text>
        </View>
      ) : null}

      <FlatList
        data={listingsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.mutedText
  },
  alert: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  separator: {
    height: spacing.sm
  }
});
