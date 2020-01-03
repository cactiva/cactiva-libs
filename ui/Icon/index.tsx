import React, { useEffect, useState } from "react";
import { View } from "react-native";

export interface IconProps {
  source:
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "Feather"
  | "FontAwesome"
  | "Foundation"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Octicons"
  | "SimpleLineIcons"
  | "Zocial";
  name: string;
  size?: number;
  color?: string;
  style?: any;
}
let iconsource: any = null;
export default ({ source, name, size, color, style }: IconProps) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (iconsource === null) {
      import("@expo/vector-icons").then((res) => {
        iconsource = res;
        setReady(true);
      });
    } else {
      setReady(true);
    }
  })

  if (!ready) {
    return <View style={style} />;
  }

  const Icon: any = (iconsource as any)[source];
  return <Icon name={name} size={size} color={color} style={style} />;
};
