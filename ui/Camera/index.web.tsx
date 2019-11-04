import React from "react";
import { Text } from "react-native";
import { DefaultTheme } from "@src/libs/theme";

export default () => {
  return (
    <Text style={{ padding: 10, color: DefaultTheme.danger }}>
      Web not support Camera
    </Text>
  );
};
