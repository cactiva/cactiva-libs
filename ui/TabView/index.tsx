import React from "react";
import { observer } from "mobx-react-lite";
import { TabView } from "react-native-tab-view";

export default observer((props: any) => {
  return <TabView {...props}></TabView>;
});
