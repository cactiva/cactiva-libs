import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  View,
  ViewProps
} from "react-native";
import { SafeAreaViewProps } from "react-navigation";
import _ from "lodash";

interface CustomViewProps
  extends ViewProps,
  ScrollViewProps,
  SafeAreaViewProps,
  KeyboardAvoidingViewProps {
  type?:
  | "View"
  | "SafeAreaView"
  | "AnimatedView"
  | "ScrollView"
  | "KeyboardAvoidingView";
  source?: any;
  shadow?: boolean;
}

export default (props: CustomViewProps) => {
  const { type, shadow } = props;
  const statusbar = StatusBar.currentHeight || 0;
  const styleShadow = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6
  };

  let style = null;
  if (typeof props.style === "number") {
    style = props.style;
  } else {
    style = {
      ...(_.get(props, "style", {}) as any),
      ...(shadow ? styleShadow : {}),
      paddingTop:
        type === "SafeAreaView" && Platform.OS === "android"
          ? statusbar
          : _.get(props, "style.paddingTop", undefined)
    };
  }

  if (type === "SafeAreaView") return <SafeAreaView {...props} style={style} />;
  if (type === "AnimatedView")
    return <Animated.View {...props} style={style} />;
  if (type === "ScrollView") {
    const style = props.style;
    const p = { ...props };
    delete p.style;
    return (
      <ScrollView
        {...p}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={style}
        style={style}
      />
    );
  }
  if (type === "KeyboardAvoidingView") {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        {...props}
        style={style}
      />
    );
  }

  return <View {...props} style={style} />;
};
