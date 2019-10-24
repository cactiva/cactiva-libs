import { Icon } from "@src/libs";
import { IconProps } from "@src/libs/ui/icon";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { useNavigation } from "react-navigation-hooks";

export interface UITextInputProps extends TextInputProps {
  icon?: IconProps;
  label?: string;
  placeholder?: string;
  value?: any;
  type?: "text" | "number" | "money" | "password" | "decimal";
  onChange: (value) => void;
  styles?: {
    root?: any;
    label?: any;
    field?: any;
    input?: any;
  };
  theme?: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
    accent: string;
  };
  [key: string]: any;
}

export default observer((props: UITextInputProps) => {
  const {
    label,
    icon,
    placeholder,
    styles,
    value,
    onChange,
    type,
    theme
  } = props;
  const dim = useDimensions().window;
  const nav = useNavigation();
  const meta = useObservable({
    focus: false,
    value: value
  });
  const onChangeText = (e: any) => {
    let v;
    switch (type) {
      default:
        v = e;
        break;
      case "number":
        v = e.replace(/\D/g, "");
        break;
    }
    meta.value = v;
    onChange && onChange(meta.value);
  };
  const withIcon = !!icon && !!icon.source && !!icon.name ? true : false;
  const onFocus = () => {
    meta.focus = !meta.focus;
  };
  const onBlur = () => {
    meta.focus = !meta.focus;
  };
  const labelText = meta.focus || !!value ? label : " ";
  const styleInput = {
    borderWidth: 0,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    color: "#3a3a3a",
    display: "flex",
    flexGrow: 1
  };
  let Component;
  switch (type) {
    default:
      Component = (
        <TextInput
          placeholder={meta.focus ? "" : label || placeholder}
          style={{
            ...styleInput,
            ...((styles && styles.input) || {})
          }}
          value={meta.value || ""}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="next"
        />
      );
      break;
    case "password":
      Component = (
        <TextInput
          placeholder={meta.focus ? "" : label || placeholder}
          style={{
            ...styleInput,
            ...((styles && styles.input) || {})
          }}
          value={meta.value || ""}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry
          returnKeyType="next"
        />
      );
      break;
    case "decimal":
    case "number":
      Component = (
        <TextInput
          placeholder={meta.focus ? "" : label || placeholder}
          style={{
            ...styleInput,
            ...((styles && styles.input) || {})
          }}
          value={`${meta.value}` || ""}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="number-pad"
          returnKeyType="next"
        />
      );
      break;
  }

  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        ...((styles && styles.root) || {})
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          paddingLeft: 5,
          paddingRight: 5,
          color: theme ? theme.primary : "#3a3a3a",
          ...((styles && styles.label) || {})
        }}
      >
        {labelText}
      </Text>
      <View
        style={{
          borderStyle: "solid",
          borderColor: meta.focus
            ? theme
              ? theme.primary
              : "#3a3a3a"
            : "#ebebeb",
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "stretch",
          paddingRight: 5,
          paddingLeft: 5,
          padding: 5,
          paddingTop: 0,
          paddingBottom: 0,
          justifyContent: "flex-start",
          display: "flex",
          ...((styles && styles.field) || {})
        }}
      >
        {!!withIcon && (
          <Icon
            source={icon.source}
            name={icon.name}
            size={24}
            color={theme ? theme.primary : "#3a3a3a"}
            style={{ marginRight: 10 }}
            {...Icon}
          />
        )}
        {Component}
      </View>
    </View>
  );
});
