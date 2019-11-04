import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import DatePicker from "../Date";
import Icon, { IconProps } from "../Icon";
import Input, { InputProps, InputType } from "../Input";
import { RadioProps, RadioModeType } from "../Radio";
import RadioGroup from "../RadioGroup";
import Select, { SelectItemProps } from "../Select";
import CheckboxGroup from "../CheckboxGroup";
import Camera, { CameraProps } from "../Camera";

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
  type?:
    | InputType
    | "select"
    | "date"
    | "radio-group"
    | "checkbox-group"
    | "camera";
  option?: {
    select?: {
      items: SelectItemProps[];
    };
    radio?: {
      items?: RadioProps[];
      style?: any;
      mode?: RadioModeType;
    };
    checkbox?: {
      items?: RadioProps[];
      style?: any;
      mode?: RadioModeType;
    };
    camera?: CameraProps;
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
  const dim = useDimensions().window;
  const platform =
    dim.width > 780 && Platform.OS === "web" ? "desktop" : "mobile";
  const meta = useObservable({
    focus: false
  });
  let labelText = meta.focus || !!value ? label : " ";
  const isIconStart =
    !!iconStart && !!iconStart.source && !!iconStart.name ? true : false;
  const isIconEnd =
    !!iconEnd && !!iconEnd.source && !!iconEnd.name ? true : false;
  const theme = {
    ...DefaultTheme,
    ..._.get(props, "theme", {}),
    ..._.get(field, "theme", {})
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
          value={value}
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
          value={value}
          placeholder={placeholder}
          onSelect={item => onChange(item.value)}
          onFocus={(e: any) => (meta.focus = e)}
        />
      );
      break;
    case "date":
      labelText = label;
      Component = (
        <DatePicker
          {...field}
          value={value}
          onChange={value => onChange(value)}
          onFocus={(e: any) => (meta.focus = e)}
        />
      );
      break;
    case "radio-group":
      labelText = label;
      Component = (
        <RadioGroup {...option.radio} onChange={onChange} value={value} />
      );
      break;
    case "checkbox-group":
      labelText = label;
      Component = (
        <CheckboxGroup {...option.checkbox} onChange={onChange} value={value} />
      );
      break;
    case "camera":
      labelText = label;
      Component = (
        <Camera
          {..._.get(option, "camera", {})}
          onCapture={onChange}
          value={value}
        />
      );
      break;
  }
  return (
    <View
      style={{
        zIndex: ["select", "date"].indexOf(type) > -1 && meta.focus ? 9 : 1,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        ...(platform === "desktop"
          ? {
              flexBasis: (dim.width - 90) / 3
            }
          : {
              flexGrow: 1,
              flexShrink: 1
            }),
        ...style,
        ..._.get(styles, "root", {})
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
