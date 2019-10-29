import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { useNavigation } from "react-navigation-hooks";
import { Icon, Select } from "../ui";
import UITextInput, { UITextInputProps } from "./UITextInput";
import { IconProps } from "../ui/icon";
import { UIThemeProps, Theme } from "../themes";

export interface UIStylesProps {
  root: any;
  label: any;
  field: any;
  input: any;
}

export interface UIFieldInputProps {
  key: any;
  styles: UIStylesProps;
  label: any;
  icon: IconProps;
  field: UITextInputProps | any;
}

export interface UIFieldProps {
  field: UIFieldInputProps;
  items: any;
  setValue?: (value: any, key: any) => void;
  theme?: UIThemeProps;
}

export default observer((props: UIFieldProps) => {
  const { field, items, setValue } = props;
  const { key, styles, label, icon } = field;
  const theme = props.theme || Theme;
  const fieldInput = field.field;
  const option = fieldInput.option;
  const dim = useDimensions().window;
  const nav = useNavigation();
  const meta = useObservable({
    focus: false,
    value: items[key]
  });
  const labelText = meta.focus || !!meta.value ? label : " ";
  const withIcon = !!icon && !!icon.source && !!icon.name ? true : false;
  const onChange = value => {
    switch (fieldInput.type) {
      case "number":
        value = !!value ? parseInt(value) : value;
        break;
    }
    setValue(value, key);
  };
  let Component;
  switch (fieldInput.type) {
    default:
      Component = (
        <UITextInput
          value={items[key]}
          onChange={onChange}
          label={field.label}
          theme={theme}
          meta={meta}
          {...field.field}
        />
      );
      break;
    case "select":
      Component = (
        <Select
          data={option.items}
          selectedOption={items[key]}
          onSelect={(v: any) => {
            onChange(v.value);
          }}
          meta={meta}
          placeholder={!meta.focus ? label : ""}
        />
      );
      break;
  }
  useEffect(() => {
    meta.value = items[key];
  }, [items[key]]);
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        zIndex: 1,
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
