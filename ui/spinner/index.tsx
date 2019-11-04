import React from "react";
import { observer } from "mobx-react-lite";
import { ActivityIndicatorProps, ActivityIndicator } from "react-native";

export default observer((props: ActivityIndicatorProps) => {
  return <ActivityIndicator {...props} />;
});
