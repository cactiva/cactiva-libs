import React from "react";
import { observer } from "mobx-react-lite";
import { ActivityIndicatorProps, ActivityIndicator } from "react-native";
import { DefaultTheme } from "../../theme";
import Theme from "@src/theme.json";

export default observer((props: ActivityIndicatorProps) => {
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  return <ActivityIndicator color={theme.primary} {...props} />;
});
