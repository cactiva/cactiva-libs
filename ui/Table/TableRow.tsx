import { observer } from "mobx-react-lite";
import React from "react";
import { View, ViewStyle, TouchableOpacity } from "react-native";
import TableColumn from "./TableColumn";

export interface IRowProps {
  style?: ViewStyle;
  children: any;
  onPress?: (item) => void;
}
export default observer((props: IRowProps) => {
  const { onPress } = props;
  let Component: any = View;
  if (onPress) Component = TouchableOpacity;
  return (
    <Component {...props}>
      {props.children ? props.children : <TableColumn></TableColumn>}
    </Component>
  );
});
