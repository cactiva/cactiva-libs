import { observer } from "mobx-react-lite";
import React from "react";
import { View, ViewStyle } from "react-native";

export interface IColumnProps {
  title?: string;
  width?: number;
  path?: string;
  style?: ViewStyle;
  onPress?: (item, path) => void;
  children?: React.ReactElement;
}
export default observer((props: IColumnProps) => {
  return <View {...props}></View>;
});
