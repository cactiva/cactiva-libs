import { Icon } from "../ui";
import { scale, uuid } from "../utils";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { useNavigation } from "react-navigation-hooks";
import { IconProps } from "../ui/icon";

export interface UIBottomNavProps {
  menus: {
    label: string;
    icon: IconProps | any;
    path: string;
    role?: string[];
  }[];
  theme?: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
    accent: string;
  };
}

export default observer((props: UIBottomNavProps) => {
  const { menus, theme } = props;
  const dim = useDimensions().window;
  const nav = useNavigation();
  const meta = useObservable({
    activePath: "",
    menus: menus
  });
  useEffect(() => {
    meta.activePath = nav.state.routeName;
    console.log(nav);
  }, [nav]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        backgroundColor: "#fff",
        padding: 5,
        borderStyle: "solid",
        borderColor: "#FCFDFD"
      }}
    >
      {meta.menus.map((item: any) => {
        return <Menu key={uuid()} meta={meta} item={item} theme={theme} />;
      })}
    </View>
  );
});

const Menu = observer((props: any) => {
  const { meta, item, theme } = props;
  const nav = useNavigation();
  const onPress = () => {
    meta.activePath = item.path;
    nav.navigate(item.path);
  };
  const active = meta.activePath === item.path;
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: active ? "flex-start" : "center",
        alignItems: "center",
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        flexGrow: 1,
        ...(!active
          ? {
              maxWidth: scale(60)
            }
          : {})
      }}
      onPress={onPress}
    >
      <Icon
        size={scale(24)}
        color={theme ? theme.primary : "#3a3a3a"}
        style={{
          marginLeft: 5,
          marginRight: active ? 10 : 5
        }}
        {...item.icon}
      ></Icon>
      {active && (
        <View
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Text
            style={{
              color: theme ? theme.primary : "#3a3a3a",
              fontSize: scale(11)
            }}
          >
            Your
          </Text>
          <Text
            style={{
              color: theme ? theme.primary : "#3a3a3a",
              fontSize: scale(14),
              fontWeight: "600"
            }}
          >
            {item.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});
