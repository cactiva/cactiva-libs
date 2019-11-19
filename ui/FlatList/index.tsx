import { observer } from "mobx-react-lite";
import React from "react";
import { FlatList, FlatListProps } from "react-native";

export default observer((props: FlatListProps<any>) => {
  return (
    <FlatList
      // onEndReached={() => dispatchFetchPage()}
      initialNumToRender={8}
      maxToRenderPerBatch={2}
      // onEndReachedThreshold={0.5}
      {...props}
    />
  );
});
