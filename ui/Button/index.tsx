import React from "react";
import { observer } from "mobx-react-lite";
import {
  TouchableOpacityProps,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { ThemeProps, DefaultTheme } from "../../theme";
import Icon, { IconProps } from "../Icon";
import _ from "lodash";
import Theme from "@src/theme.json";

interface ButtonStyles {
  wrapper?: any;
  label?: any;
}

export interface ButtonProps extends TouchableOpacityProps {
  label?: string;
  iconStart?: IconProps | any;
  iconEnd?: IconProps | any;
  styles?: ButtonStyles;
  shadow?: Boolean;
  type?: "submit";
  children?: any;
}

export default observer((props: ButtonProps) => {
  const {
    label,
    iconStart,
    iconEnd,
    styles,
    disabled,
    children,
    shadow
  } = props;
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  const isIconStart =
    !!iconStart && !!iconStart.source && !!iconStart.name ? true : false;
  const isIconEnd =
    !!iconEnd && !!iconEnd.source && !!iconEnd.name ? true : false;
  const styleShadow = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6
  };
  return (
    <TouchableOpacity
      {...props}
      style={{
        borderRadius: 4,
        backgroundColor: theme.primary,
        display: "flex",
        alignItems: "stretch",
        opacity: disabled ? 0.8 : 1,
        minWidth: 50,
        paddingTop: 10,
        paddingBottom: 10,
        ...(_.get(props, "style", {}) as any),
        ...(shadow ? styleShadow : {})
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
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
        {children}
        {isIconEnd && typeof iconEnd === "object" ? (
          <Icon {...iconEnd} />
        ) : React.isValidElement(iconEnd) ? (
          iconEnd
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
