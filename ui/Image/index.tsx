import { observer } from "mobx-react-lite";
import React from "react";
import { Image, ImageProps } from "react-native";

export default observer((props: ImageProps) => {
  return <Image {...props} />;
});
