import React from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewProps,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";

interface CustomViewProps extends ViewProps {
  type?:
    | "View"
    | "SafeAreaView"
    | "AnimatedView"
    | "ScrollView"
    | "KeyboardAvoidingView";
  children?: any;
}

export default (props: CustomViewProps) => {
  const { type } = props;
  const statusbar = StatusBar.currentHeight || 0;
  const safeAreaStyle = StyleSheet.flatten([
    {
      paddingTop: Platform.OS === "android" ? statusbar : 0
    },
    props.style
  ]);
  if (type === "SafeAreaView")
    return <SafeAreaView {...props} style={safeAreaStyle} />;
  if (type === "AnimatedView") return <Animated.View {...props} />;
  if (type === "ScrollView") {
    const style = props.style;
    const p = { ...props };
    delete p.style;
    return <ScrollView {...p} contentContainerStyle={style} />;
  }
  if (type === "KeyboardAvoidingView") {
    return <KeyboardAvoidingView behavior="padding" enabled {...props} />;
  }
  return <View {...props} />;
};
