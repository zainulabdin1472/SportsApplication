import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "../theme/tokens";
import { AppText } from "./AppText";
import { GradientBackground } from "./GradientBackground";
import { GradientTitle } from "./AppText";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  headerAccessory?: ReactNode;
};

export function Screen({ title, subtitle, children, scroll, contentStyle, headerAccessory }: Props) {
  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {(title || headerAccessory) && (
          <View style={styles.header}>
            <View style={styles.headerText}>
              {title ? <GradientTitle>{title}</GradientTitle> : null}
              {subtitle ? (
                <AppText variant="subtitle" style={styles.subtitle}>
                  {subtitle}
                </AppText>
              ) : null}
            </View>
            {headerAccessory ? <View style={styles.accessory}>{headerAccessory}</View> : null}
          </View>
        )}
        {body}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: spacing.xs
  },
  accessory: {
    paddingTop: spacing.xs
  },
  subtitle: {
    marginTop: spacing.xxs
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.lg
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md
  }
});
