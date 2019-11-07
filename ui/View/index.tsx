import React from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewProps
} from "react-native";

interface CustomViewProps extends ViewProps {
  safeAreaView?: boolean;
  animatedView?: boolean;
  children?: any;
}

export default (props: CustomViewProps) => {
  const { safeAreaView, animatedView } = props;
  const statusbar = StatusBar.currentHeight || 0;
  const safeAreaStyle = StyleSheet.flatten([
    {
      paddingTop: Platform.OS === "android" ? statusbar : 0
    },
    props.style
  ]);
  if (safeAreaView) return <SafeAreaView {...props} style={safeAreaStyle} />;
  if (animatedView) return <Animated.View {...props} />;
  return <View {...props} />;
};
