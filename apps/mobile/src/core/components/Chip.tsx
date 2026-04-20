import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors, radii, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ label, selected, onPress, style }: Props) {
  const content = (
    <AppText variant="caption" style={[styles.caption, selected && styles.captionSelected]}>
      {label}
    </AppText>
  );

  if (!onPress) {
    return (
      <Pressable style={[styles.base, selected && styles.selected, style]} disabled>
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && styles.pressed,
        style
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  selected: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.accentSoft
  },
  pressed: {
    opacity: 0.9
  },
  caption: {
    color: colors.textSecondary,
    letterSpacing: 0.8
  },
  captionSelected: {
    color: colors.accent
  }
});
