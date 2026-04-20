import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ApiError, createListing } from "../../../core/api/client";
import { AppText } from "../../../core/components/AppText";
import { Button } from "../../../core/components/Button";
import { Screen } from "../../../core/components/Screen";
import { TextField } from "../../../core/components/TextField";
import { useSession } from "../../../core/session/SessionContext";
import { colors, radii, spacing } from "../../../core/theme/tokens";

const conditions = [
  { value: "new" as const, label: "New" },
  { value: "like_new" as const, label: "Like new" },
  { value: "used" as const, label: "Used" }
];

export function CreateListingScreen() {
  const queryClient = useQueryClient();
  const { sellerId, isReady } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [sportTag, setSportTag] = useState("");
  const [condition, setCondition] = useState<"new" | "like_new" | "used">("like_new");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!sellerId) {
        throw new Error("Set your seller UUID in Account before posting.");
      }
      const parsedPrice = Number(price);
      return createListing(
        {
          title,
          description,
          price: parsedPrice,
          condition,
          city,
          sportTag
        },
        sellerId
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      Alert.alert("Listed", "Your gear is live on the marketplace.");
      setTitle("");
      setDescription("");
      setPrice("");
      setCity("");
      setSportTag("");
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError ? error.message : "Could not create listing.";
      Alert.alert("Unable to publish", message);
    }
  });

  return (
    <Screen
      scroll
      title="Sell gear"
      subtitle="Publish a premium listing with crisp photos coming next iteration."
    >
      {!isReady ? <AppText variant="subtitle">Preparing secure session...</AppText> : null}

      {!sellerId ? (
        <View style={styles.warning}>
          <AppText variant="title" style={styles.warningTitle}>
            Seller identity required
          </AppText>
          <AppText variant="subtitle">
            Add your Supabase user UUID in Account so the API can attach listings to your profile.
          </AppText>
        </View>
      ) : null}

      <TextField label="Title" placeholder="Carbon road bike, size 54" value={title} onChangeText={setTitle} />
      <TextField
        label="Description"
        placeholder="Tell buyers about condition, usage, and what is included."
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.multiline}
      />
      <TextField label="Price (USD)" placeholder="249" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <TextField label="City" placeholder="Karachi" value={city} onChangeText={setCity} />
      <TextField label="Sport tag" placeholder="cycling, running, cricket..." value={sportTag} onChangeText={setSportTag} />

      <AppText variant="label" style={styles.sectionLabel}>
        Condition
      </AppText>
      <View style={styles.conditionRow}>
        {conditions.map((item) => (
          <Button
            key={item.value}
            label={item.label}
            variant={condition === item.value ? "primary" : "ghost"}
            onPress={() => setCondition(item.value)}
            style={styles.conditionButton}
          />
        ))}
      </View>

      <Button
        label={mutation.isPending ? "Publishing..." : "Publish listing"}
        loading={mutation.isPending}
        disabled={!sellerId}
        onPress={() => mutation.mutate()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  warning: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.xs
  },
  warningTitle: {
    fontSize: 18
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top"
  },
  sectionLabel: {
    marginTop: spacing.sm
  },
  conditionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  conditionButton: {
    flexGrow: 1
  }
});
