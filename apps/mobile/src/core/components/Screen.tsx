import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Screen({ title, subtitle, children }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.mutedText,
    marginTop: spacing.xs
  },
  content: {
    marginTop: spacing.lg,
    gap: spacing.md
  }
});
