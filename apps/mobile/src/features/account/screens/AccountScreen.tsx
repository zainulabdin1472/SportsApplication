import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { fetchHealth } from "../../../core/api/client";
import { AppText } from "../../../core/components/AppText";
import { Button } from "../../../core/components/Button";
import { Screen } from "../../../core/components/Screen";
import { TextField } from "../../../core/components/TextField";
import { useSession } from "../../../core/session/SessionContext";
import { colors, radii, spacing } from "../../../core/theme/tokens";

export function AccountScreen() {
  const { sellerId, setSellerId, generateDevSellerId, isReady } = useSession();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (sellerId) {
      setDraft(sellerId);
    }
  }, [sellerId]);

  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    staleTime: 30_000
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await setSellerId(draft.trim() || null);
    }
  });

  return (
    <Screen
      scroll
      title="Account"
      subtitle="Wire your Supabase identity for trusted listings and payouts."
    >
      {!isReady ? <AppText variant="subtitle">Loading secure preferences...</AppText> : null}

      <View style={styles.card}>
        <AppText variant="label">Seller UUID</AppText>
        <AppText variant="subtitle">
          Paste the auth.users.id value from Supabase so listing inserts satisfy the profiles foreign key.
        </AppText>
        <TextField
          label="UUID"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          autoCapitalize="none"
          value={draft}
          onChangeText={setDraft}
        />
        <View style={styles.row}>
          <Button label="Save identity" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} />
          <Button label="Generate dev UUID" variant="ghost" onPress={() => void generateDevSellerId()} />
        </View>
      </View>

      <View style={styles.card}>
        <AppText variant="label">API health</AppText>
        {healthQuery.isLoading ? <AppText variant="subtitle">Pinging backend...</AppText> : null}
        {healthQuery.isError ? (
          <AppText variant="subtitle" style={styles.error}>
            Offline — confirm `npm run dev:api` and `EXPO_PUBLIC_API_URL` (use `http://10.0.2.2:4000/api/v1` for Android
            emulator).
          </AppText>
        ) : null}
        {healthQuery.data ? (
          <View style={styles.health}>
            <AppText variant="title" style={styles.healthTitle}>
              {healthQuery.data.status.toUpperCase()}
            </AppText>
            <AppText variant="subtitle">{healthQuery.data.service}</AppText>
            <AppText variant="caption" style={styles.timestamp}>
              {healthQuery.data.timestamp}
            </AppText>
          </View>
        ) : null}
        <Button label="Refresh status" variant="ghost" onPress={() => void healthQuery.refetch()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    gap: spacing.md
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  error: {
    color: colors.danger
  },
  health: {
    gap: spacing.xs
  },
  healthTitle: {
    color: colors.success,
    fontSize: 20
  },
  timestamp: {
    color: colors.textMuted,
    textTransform: "none"
  }
});
