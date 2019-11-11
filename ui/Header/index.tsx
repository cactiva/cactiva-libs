import Theme from "@src/theme.json";
import { observer } from "mobx-react-lite";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { DefaultTheme } from "../../theme";
import Icon from "../Icon";

export interface UIHeaderProps {
  leftAction?: boolean;
  safeAreaView?: boolean;
  title?: string | object;
  style?: any;
  styles?: {
    root?: any;
    title?: any;
  };
  children?: any;
  shadow?: Boolean;
}

export default observer((props: UIHeaderProps) => {
  const {
    leftAction,
    title,
    children,
    style,
    styles,
    safeAreaView,
    shadow
  } = props;
  const statusbar = StatusBar.currentHeight || 0;
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  const nav = useNavigation();

  const onGoBack = () => {
    nav.goBack();
  };

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
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        padding: 5,
        borderStyle: "solid",
        backgroundColor: "#fff",
        marginTop: safeAreaView ? -statusbar : 0,
        paddingTop: safeAreaView ? statusbar : 5,
        ...style,
        ...(styles ? styles.root : {}),
        ...(shadow ? styleShadow : {})
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {leftAction && (
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
        {children}
      </View>
    </View>
  );
});
