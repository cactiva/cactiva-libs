import { observer } from "mobx-react-lite";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DefaultTheme, ThemeProps } from "../../theme";
import Icon from "../Icon";
import Theme from "@src/theme.json";
import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

export type RadioModeType = "default" | "checkbox";

export interface RadioProps {
  text?: string;
  value?: any;
  mode?: RadioModeType;
  checked?: boolean;
  onPress?: (value: boolean) => void;
  style?: any;
  theme?: ThemeProps;
}

export default observer((props: RadioProps) => {
  const { text, onPress, style, value, mode } = props;
  const checked = props.checked === true ? true : false;
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };

  return (
    <TouchableOpacity
      style={{
        marginTop: 5,
        marginBottom: 5
      }}
      onPress={() => {
        onPress && onPress(!checked);
      }}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          ...style
        }}
      >
        {mode === "checkbox" ? (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
              backgroundColor: checked ? theme.primary : theme.light,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: checked ? theme.primary : theme.medium,
              width: 20,
              height: 20,
              borderRadius: 4,
              marginRight: 8
            }}
          >
            <Icon
              source="Entypo"
              name="check"
              size={16}
              color={checked ? "white" : theme.light}
            />
          </View>
        ) : (<View style={{
          marginRight: 8
        }}>
          <Svg width="20" height="20" viewBox="0 0 400 400" fill="none">
            <Circle cx="200" cy="200" r="195" stroke={theme.medium} fill={"white"} strokeWidth={20} />
            <Circle cx="200" cy="200" r="100" fill={checked ? theme.primary : "white"} />
          </Svg>
        </View>
          )}
        <Text
          style={{
            color: theme.dark
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
