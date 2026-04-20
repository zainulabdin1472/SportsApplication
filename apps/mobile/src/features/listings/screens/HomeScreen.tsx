import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from "react-native";
import type { ListingFilters } from "../../../core/api/client";
import { fetchListings } from "../../../core/api/client";
import { AppText } from "../../../core/components/AppText";
import { Chip } from "../../../core/components/Chip";
import { Screen } from "../../../core/components/Screen";
import { TextField } from "../../../core/components/TextField";
import { useSession } from "../../../core/session/SessionContext";
import { colors, spacing } from "../../../core/theme/tokens";
import type { HomeStackParamList } from "../../../navigation/types";
import { ListingCard } from "../components/ListingCard";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const { sellerId } = useSession();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState<"new" | "like_new" | "used" | "all">("all");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(handle);
  }, [search]);

  const filters = useMemo<ListingFilters>(
    () => ({
      search: debouncedSearch || undefined,
      city: city.trim() || undefined,
      condition: condition === "all" ? undefined : condition,
      limit: 30
    }),
    [debouncedSearch, city, condition]
  );

  const listingsQuery = useQuery({
    queryKey: ["listings", filters, sellerId],
    queryFn: () => fetchListings(filters, sellerId),
    enabled: true
  });

  const onRefresh = useCallback(() => {
    void listingsQuery.refetch();
  }, [listingsQuery]);

  return (
    <Screen
      scroll={false}
      title="SportsGear"
      subtitle="Premium marketplace for athletes. Curated listings, trusted sellers."
      contentStyle={styles.screenBody}
    >
      <TextField
        label="Search"
        placeholder="Try “carbon road bike” or “size 10 cleats”"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        returnKeyType="search"
      />
      <TextField
        label="City"
        placeholder="Filter by city"
        value={city}
        onChangeText={setCity}
        autoCapitalize="words"
      />

      <View style={styles.filterRow}>
        <Chip label="All" selected={condition === "all"} onPress={() => setCondition("all")} />
        <Chip label="New" selected={condition === "new"} onPress={() => setCondition("new")} />
        <Chip label="Like new" selected={condition === "like_new"} onPress={() => setCondition("like_new")} />
        <Chip label="Used" selected={condition === "used"} onPress={() => setCondition("used")} />
      </View>

      {listingsQuery.isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.accent} />
          <AppText variant="subtitle">Loading listings...</AppText>
        </View>
      ) : null}

      {listingsQuery.isError ? (
        <View style={styles.alert}>
          <AppText variant="title" style={styles.alertTitle}>
            Connection issue
          </AppText>
          <AppText variant="subtitle">
            Check API URL in `.env`, device network, and that the backend is running.
          </AppText>
        </View>
      ) : null}

      <FlatList
        style={styles.list}
        data={listingsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={listingsQuery.isFetching} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          listingsQuery.isSuccess ? (
            <View style={styles.empty}>
              <AppText variant="title">No listings yet</AppText>
              <AppText variant="subtitle">Switch filters or post the first item from the Sell tab.</AppText>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => navigation.navigate("ListingDetail", { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBody: {
    flex: 1,
    paddingTop: spacing.sm
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  loader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  alert: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.xs
  },
  alertTitle: {
    fontSize: 18
  },
  listContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm
  },
  separator: {
    height: spacing.sm
  },
  empty: {
    paddingVertical: spacing.xl,
    gap: spacing.xs
  },
  list: {
    flex: 1
  }
});
