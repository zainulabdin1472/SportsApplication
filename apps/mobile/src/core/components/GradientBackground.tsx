import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/tokens";

type Props = {
  children: ReactNode;
};

export function GradientBackground({ children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.canvas, colors.background, colors.surfaceMuted]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(201,169,98,0.12)", "transparent", "rgba(63,208,201,0.06)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas
  }
});
