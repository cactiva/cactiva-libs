import React from "react";
import { observer } from "mobx-react-lite";
import {
  TouchableOpacityProps,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { ThemeProps, DefaultTheme } from "../../theme";
import Icon, { IconProps } from "../icon";
import _ from "lodash";

interface ButtonStyles {
  wrapper?: any;
  label?: any;
}

export interface ButtonProps extends TouchableOpacityProps {
  label?: string;
  iconStart?: IconProps | any;
  iconEnd?: IconProps | any;
  theme?: ThemeProps;
  styles?: ButtonStyles;
}

export default observer((props: ButtonProps) => {
  const { label, iconStart, iconEnd, styles, disabled } = props;
  const theme = {
    ...DefaultTheme,
    ...props.theme
  };
  const isIconStart =
    !!iconStart && !!iconStart.source && !!iconStart.name ? true : false;
  const isIconEnd =
    !!iconEnd && !!iconEnd.source && !!iconEnd.name ? true : false;

  return (
    <TouchableOpacity
      {...props}
      style={{
        borderRadius: 4,
        backgroundColor: theme.primary,
        display: "flex",
        alignItems: "stretch",
        opacity: disabled ? 0.8 : 1,
        minWidth: 60,
        ...(_.get(props, "style", {}) as any)
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 45,
          ..._.get(styles, "wrapper", {})
        }}
      >
        {isIconStart && typeof iconStart === "object" ? (
          <Icon {...iconStart} />
        ) : React.isValidElement(iconStart) ? (
          iconStart
        ) : null}
        {label !== undefined && (
          <Text
            style={{
              color: "#fff",
              padding: 10,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
              ..._.get(styles, "label", {})
            }}
          >
            {label}
          </Text>
        )}
        {isIconEnd && typeof iconEnd === "object" ? (
          <Icon {...iconEnd} />
        ) : React.isValidElement(iconEnd) ? (
          iconEnd
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
