import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Text, View } from "react-native";
import { Icon, Input } from "../";
import { DefaultTheme, ThemeProps } from "../../theme";
import { IconProps } from "../icon";
import { InputProps, InputType } from "../input";

interface StylesFieldProps {
  root?: any;
  label?: any;
  field?: any;
}

export interface FieldProps {
  label: string;
  field?: InputProps;
  value?: any;
  setValue?: (value: any) => void;
  type?: InputType | "select" | "date";
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
    styles
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
    // case "select":
    //   Component = (
    //     <Select
    //       items={option.items}
    //       value={items[key]}
    //       onChange={onChange}
    //       label={field.label}
    //     />
    //   );
    //   break;
  }
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        zIndex: 1,
        ...style,
        ...((styles && styles.root) || {})
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          paddingLeft: 5,
          paddingRight: 5,
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
        {!!isIconStart && (
          <Icon
            source={iconStart.source}
            name={iconStart.name}
            size={24}
            color={theme.primary}
            style={{ marginRight: 10 }}
            {...Icon}
          />
        )}
        {Component}
        {!!isIconEnd && (
          <Icon
            source={iconEnd.source}
            name={iconEnd.name}
            size={24}
            color={theme.primary}
            style={{ marginLeft: 10 }}
            {...Icon}
          />
        )}
      </View>
    </View>
  );
});
