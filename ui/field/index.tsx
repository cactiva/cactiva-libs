import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Text, View } from "react-native";
import { DefaultTheme, ThemeProps } from "../../theme";
import Icon, { IconProps } from "../icon";
import Input, { InputProps, InputType } from "../input";
import Select, { SelectItemProps } from "../select";

interface StylesFieldProps {
  root?: any;
  label?: any;
  field?: any;
  iconStart?: any;
  iconEnd?: any;
}

export interface FieldProps {
  label: string;
  field?: InputProps;
  value?: any;
  setValue?: (value: any) => void;
  type?: InputType | "select" | "date";
  option?: {
    select?: {
      items: SelectItemProps[];
    };
  };
  iconStart?: IconProps;
  iconEnd?: IconProps;
  theme?: ThemeProps;
  style?: any;
  styles?: StylesFieldProps;
}

export default observer((props: FieldProps) => {
  const {
    value,
    setValue,
    label,
    iconStart,
    iconEnd,
    type,
    style,
    styles,
    option
  } = props;
  let field = props.field;
  const meta = useObservable({
    focus: false,
    value: value
  });
  const labelText = meta.focus || !!meta.value ? label : " ";
  const isIconStart =
    !!iconStart && !!iconStart.source && !!iconStart.name ? true : false;
  const isIconEnd =
    !!iconEnd && !!iconEnd.source && !!iconEnd.name ? true : false;
  const theme = {
    ...DefaultTheme,
    ...props.theme
  };
  const placeholder = meta.focus
    ? field && field.placeholder
      ? field.placeholder
      : ""
    : label;
  const onChange = value => {
    switch (type) {
      case "number":
        value = !!value ? parseInt(value) : value;
        break;
    }
    meta.value = value;
    setValue(value);
  };
  let Component;
  switch (type) {
    default:
      if (!field)
        field = {
          type: type as any,
          style: {}
        };
      field.type = type as any;
      Component = (
        <Input
          {...field}
          value={meta.value}
          onChangeText={onChange}
          placeholder={placeholder}
          onFocus={() => (meta.focus = true)}
          onBlur={() => (meta.focus = false)}
        />
      );
      break;
    case "select":
      Component = (
        <Select
          {...field}
          items={option.select.items}
          value={meta.value}
          placeholder={placeholder}
          onSelect={item => onChange(item.value)}
        />
      );
      break;
  }
  return (
    <View
      style={{
        zIndex: type === "select" ? 9 : 1,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        ...style,
        ...((styles && styles.root) || {})
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 5,
          color: theme.primary,
          ...((styles && styles.label) || {})
        }}
      >
        {labelText}
      </Text>
      <View
        style={{
          borderStyle: "solid",
          borderColor: meta.focus ? theme.primary : theme.light,
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "stretch",
          paddingRight: 2,
          paddingLeft: 2,
          padding: 5,
          justifyContent: "flex-start",
          display: "flex",
          ...((styles && styles.field) || {})
        }}
      >
        {!!isIconStart && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...((styles && styles.iconStart) || {})
            }}
          >
            <Icon
              size={24}
              color={theme.primary}
              style={{ marginRight: 10 }}
              {...iconStart}
            />
          </View>
        )}
        {Component}
        {!!isIconEnd && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...((styles && styles.iconEnd) || {})
            }}
          >
            <Icon
              size={24}
              color={theme.primary}
              style={{ marginLeft: 10 }}
              {...iconEnd}
            />
          </View>
        )}
      </View>
    </View>
  );
});
