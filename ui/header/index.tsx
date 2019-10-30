import { observer } from "mobx-react-lite";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import { Icon } from "../";

export interface UIHeaderProps {
  leftAction?: "Default" | object;
  title: string | object;
  rightAction?: object;
  theme?: ThemeProps;
  style?: any;
  styles?: {
    root?: any;
    title?: any;
  };
}

export default observer((props: UIHeaderProps) => {
  const { leftAction, title, rightAction, style, styles } = props;
  const theme = {
    ...DefaultTheme,
    ...props.theme
  };
  const nav = useNavigation();

  const onGoBack = () => {
    nav.goBack();
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderStyle: "solid",
        ...style,
        ...(styles ? styles.root : {})
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {leftAction === "Default" ? (
          <TouchableOpacity onPress={onGoBack}>
            <Icon
              source={"AntDesign"}
              name={"arrowleft"}
              color={theme.primary}
              size={24}
              style={{
                margin: 5
              }}
            ></Icon>
          </TouchableOpacity>
        ) : (
          typeof leftAction === "object" &&
          React.isValidElement(leftAction) &&
          leftAction
        )}
      </View>

      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          minHeight: 45
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 5
          }}
        >
          {typeof title === "string" ? (
            <Text
              style={{
                color: theme.primary,
                fontSize: 16,
                fontWeight: "bold",
                ...(styles ? styles.title : {})
              }}
            >
              {title}
            </Text>
          ) : (
            typeof title === "object" && React.isValidElement(title) && title
          )}
        </View>
        {typeof rightAction === "object" &&
          React.isValidElement(rightAction) &&
          rightAction}
      </View>
    </View>
  );
});
