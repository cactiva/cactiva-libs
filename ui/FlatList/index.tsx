import { observer } from "mobx-react-lite";
import React from "react";
import { FlatList, FlatListProps } from "react-native";

export default observer((props: FlatListProps<any>) => {
  return <FlatList {...props} />;
});
