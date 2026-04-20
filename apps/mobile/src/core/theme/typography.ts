import { TextStyle } from "react-native";
import { colors } from "./tokens";

export const typography = {
  display: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: colors.text
  } satisfies TextStyle,
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: colors.text
  } satisfies TextStyle,
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
    lineHeight: 22
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.text,
    lineHeight: 22
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textMuted
  } satisfies TextStyle,
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary
  } satisfies TextStyle,
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: -0.3
  } satisfies TextStyle
};
