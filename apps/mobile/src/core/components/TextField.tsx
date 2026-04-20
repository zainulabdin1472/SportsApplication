import { ReactNode } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors, radii, spacing } from "../theme/tokens";
import { AppText } from "./AppText";

type Props = TextInputProps & {
  label: string;
  hint?: string;
  accessory?: ReactNode;
};

export function TextField({ label, hint, accessory, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.fieldRow}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...rest}
        />
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
      {hint ? (
        <AppText variant="caption" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs
  },
  label: {
    color: colors.textSecondary
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15
  },
  accessory: {
    paddingRight: spacing.sm
  },
  hint: {
    color: colors.textMuted,
    textTransform: "none",
    letterSpacing: 0.2
  }
});
