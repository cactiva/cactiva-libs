import React from "react";
import {
  View,
  ViewProps,
  Animated,
  Platform,
  StyleSheet,
  SafeAreaView
} from "react-native";

interface CustomViewProps extends ViewProps {
  safeAreaView?: boolean;
  animatedView?: boolean;
  children?: any;
}

export default (props: CustomViewProps) => {
  const { safeAreaView, animatedView } = props;
  const safeAreaStyle = StyleSheet.flatten([
    {
      paddingTop: Platform.OS === "android" ? 35 : 0
    },
    props.style
  ]);
  if (safeAreaView) return <SafeAreaView {...props} style={safeAreaStyle} />;
  if (animatedView) return <Animated.View {...props} />;
  return <View {...props} />;
};
