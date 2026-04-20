import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors, radii, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = "primary", disabled, loading, style }: Props) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isGhost && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.accent : colors.canvas} />
      ) : (
        <AppText
          variant="label"
          style={[
            styles.label,
            isPrimary && styles.labelPrimary,
            isGhost && styles.labelGhost,
            variant === "danger" && styles.labelDanger
          ]}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.borderStrong
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border
  },
  danger: {
    backgroundColor: "rgba(255,107,107,0.12)",
    borderColor: "rgba(255,107,107,0.35)"
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.45
  },
  label: {
    textTransform: "none",
    letterSpacing: 0.2
  },
  labelPrimary: {
    color: colors.canvas
  },
  labelGhost: {
    color: colors.accent
  },
  labelDanger: {
    color: colors.danger
  }
});
