import React from "react";
import { observer } from "mobx-react-lite";
import { TextProps, Text } from "react-native";
import _ from "lodash";
import Theme from "@src/theme.json";
import { DefaultTheme } from "../../theme";

export default observer((props: TextProps) => {
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  const style = {
    fontSize: Theme.fontSize,
    color: theme.dark,
    fontFamily: _.get(Theme, "fontFamily", undefined),
    ...(_.get(props, "style", {}) as any)
  };
  return <Text {...props} style={style} />;
});
