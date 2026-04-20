import { ReactNode } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { colors } from "../theme/tokens";
import { typography } from "../theme/typography";

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  children: ReactNode;
};

export function AppText({ variant = "body", color, style, children, ...rest }: Props) {
  const base = typography[variant] as TextStyle;
  return (
    <Text style={[base, color ? { color } : null, style]} {...rest}>
      {children}
    </Text>
  );
}

export function GradientTitle({ children }: { children: ReactNode }) {
  return (
    <Text style={styles.gradientTitle} numberOfLines={2}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  gradientTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: colors.text
  }
});
