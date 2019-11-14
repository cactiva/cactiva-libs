import React from "react";
import { WebView, WebViewProps } from "react-native";
import HTML from "react-native-render-html";

export default (props: any) => {
  return <HTML {...props} />;
};
