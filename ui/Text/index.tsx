import React from "react";
import { observer } from "mobx-react-lite";
import { TextProps, Text } from "react-native";

export default observer((props: TextProps) => {
  return <Text {...props} />;
});
