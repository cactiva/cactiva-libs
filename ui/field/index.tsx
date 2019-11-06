import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import Icon, { IconProps } from "../Icon";
import { InputProps, InputType } from "../Input";
import { uuid } from "../../utils";

interface StylesFieldProps {
  root?: any;
  label?: any;
  field?: any;
  iconStart?: any;
  iconEnd?: any;
}

export interface FieldProps {
  label: string;
  path: string;
  field?: InputProps;
  value?: any;
  setValue?: (value: any) => void;
  type?:
    | InputType
    | "select"
    | "date"
    | "radio-group"
    | "checkbox-group"
    | "camera"
    | "location";
  iconStart?: IconProps;
  iconEnd?: IconProps;
  theme?: ThemeProps;
  style?: any;
  styles?: StylesFieldProps;
  children?: any;
  isRequired?: boolean;
  validate?: (value: any) => void;
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
    children,
    isRequired,
    validate
  } = props;
  let field = props.field;
  const dim = useDimensions().window;
  const platform =
    dim.width > 780 && Platform.OS === "web" ? "desktop" : "mobile";
  const meta = useObservable({
    focus: false,
    validate: false,
    error: false,
    errorMessage: []
  });
  let labelText =
    meta.focus || !!value || meta.error
      ? label + (isRequired === true ? " *" : "")
      : " ";
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
    : !meta.error
    ? label + (isRequired === true ? " *" : "")
    : "";
  const onChange = value => {
    switch (type) {
      case "number":
        value = !!value ? parseInt(value) : value;
        break;
    }
    if (isRequired && !value) {
      meta.error = true;
      meta.errorMessage = [`${label} is required.`];
    }
    if (meta.error && !!value) {
      meta.error = false;
      meta.errorMessage = [];
    }
    if (!meta.validate) meta.validate = true;
    if (validate) {
      let res: any = validate(value);
      if (res !== false && res !== undefined) {
        meta.error = true;
        meta.errorMessage = res;
      } else {
        meta.error = false;
        meta.errorMessage = [];
      }
    }
    setValue && setValue(value);
  };
  const fieldType = _.get(children, "props.fieldType", "input");
  let childProps;
  switch (fieldType) {
    default:
      if (!field)
        field = {
          type: type as any,
          style: {},
          fieldType: "input"
        };
      field.type = type as any;
      field.fieldType = "input";
      childProps = {
        ...field,
        value: value,
        onChangeText: onChange,
        placeholder: placeholder,
        onFocus: () => (meta.focus = true),
        onBlur: () => (meta.focus = false)
      };
      break;
    case "select":
      childProps = {
        ...field,
        value: value,
        placeholder: placeholder,
        onSelect: value => onChange(value),
        onFocus: (e: any) => (meta.focus = e)
      };
      break;
    case "date":
      labelText = label;
      childProps = {
        ...field,
        value: value,
        onChange: value => onChange(value),
        onFocus: (e: any) => (meta.focus = e)
      };
      break;
    case "radio-group":
      labelText = label;
      childProps = {
        onChange: onChange,
        value: value
      };
      break;
    case "checkbox-group":
      labelText = label;
      childProps = {
        onChange: onChange,
        value: value
      };
      break;
    case "camera":
      labelText = label;
      childProps = {
        onCapture: onChange,
        value: value
      };
      break;
    case "location":
      labelText = label;
      childProps = {
        onCapture: onChange,
        value: value
      };
      break;
  }
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, {
      ...child.props,
      ...childProps
    })
  );
  return (
    <View
      style={{
        zIndex:
          ["select", "date"].indexOf(fieldType) > -1 && meta.focus ? 9 : 1,
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
          color: meta.error ? theme.danger : theme.primary,
          ...((styles && styles.label) || {})
        }}
      >
        {labelText}
      </Text>
      <View
        style={{
          borderStyle: "solid",
          borderColor: meta.error
            ? theme.danger
            : meta.focus
            ? theme.primary
            : theme.light,
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
        {childrenWithProps}
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
      {meta.error &&
        meta.errorMessage.length > 0 &&
        meta.errorMessage.map(message => (
          <Text
            key={uuid()}
            style={{
              paddingTop: 5,
              fontSize: 12,
              color: theme.danger
            }}
          >
            *{message}
          </Text>
        ))}
    </View>
  );
});
