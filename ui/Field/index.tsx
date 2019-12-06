import Theme from "@src/theme.json";
import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import { textStyle, uuid } from "../../utils";
import { CameraProps } from "../Camera";
import { CheckboxProps } from "../Checkbox";
import { CheckboxGroupProps } from "../CheckboxGroup";
import DatePicker, { DateTimeProps } from "../DatePicker";
import Icon, { IconProps } from "../Icon";
import { InputProps } from "../Input";
import { LocationProps } from "../Location";
import { RadioProps } from "../Radio";
import RadioGroup, { RadioGroupProps } from "../RadioGroup";
import Select, { SelectProps } from "../Select";

interface StylesFieldProps {
  root?: any;
  label?: any;
  field?: any;
  iconStart?: any;
  iconEnd?: any;
}

export interface FieldProps {
  label?: string;
  isLabel?: boolean;
  path?: string;
  field?:
    | InputProps
    | SelectProps
    | DateTimeProps
    | RadioGroupProps
    | RadioProps
    | CheckboxGroupProps
    | CheckboxProps
    | CameraProps
    | LocationProps;
  value?: any;
  setValue?: (value: any) => void;
  iconStart?: IconProps;
  iconEnd?: IconProps;
  theme?: ThemeProps;
  style?: any;
  styles?: StylesFieldProps;
  children?: any;
  isRequired?: boolean;
  isValidate?: boolean;
  isValid?: (status: boolean) => void;
  validate?: (value: any) => void;
}

export default observer((props: FieldProps) => {
  const {
    value,
    setValue,
    label,
    iconStart,
    iconEnd,
    styles,
    children,
    isRequired,
    validate,
    isLabel,
    isValidate,
    isValid
  } = props;
  let field = props.field;
  const dim = useDimensions().window;
  const meta = useObservable({
    focus: false,
    validate: false,
    error: false,
    errorMessage: []
  });
  let labelText =
    isLabel == false || !label ? "" : label + (isRequired ? " *" : "");
  const isIconStart =
    !!iconStart && !!iconStart.source && !!iconStart.name ? true : false;
  const isIconEnd =
    !!iconEnd && !!iconEnd.source && !!iconEnd.name ? true : false;
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  const placeholder =
    !meta.error && !meta.focus ? _.get(children, "props.placeholder", "") : "";

  const onChange = value => {
    switch (_.get(children, "props.type", "text")) {
      case "decimal":
        value = !!value ? value * 1 : value;
        break;
    }
    validation(value);
    setValue && setValue(value);
  };
  const validation = value => {
    if (isRequired && !value) {
      meta.error = true;
      meta.errorMessage = [`${label} is required!`];
    }
    if (meta.error && !!value) {
      meta.error = false;
      meta.errorMessage = [];
    }
    if (!meta.validate) meta.validate = true;
    if (validate) {
      let res: any = validate(value);
      if (res !== false && res !== undefined && res !== null) {
        meta.error = true;
        meta.errorMessage = res;
      } else {
        meta.error = false;
        meta.errorMessage = [];
      }
    }
    isValid && isValid(!meta.error);
  };

  const fieldType = children.type;
  const childStyle = { ..._.get(children, "props.style", {}), flex: 1 };
  let childProps;
  switch (fieldType) {
    default:
      childProps = {
        style: childStyle,
        value: value,
        onChangeText: onChange,
        placeholder: placeholder,
        onFocus: () => (meta.focus = true),
        onBlur: () => (meta.focus = false)
      };
      break;
    case Select:
      childProps = {
        style: childStyle,
        value: value,
        placeholder: placeholder,
        onSelect: value =>
          onChange(
            typeof value === "string" ? value : value.value || value.text
          ),
        onFocus: (e: any) => (meta.focus = e)
      };
      break;
    case DatePicker:
      childProps = {
        style: childStyle,
        value: value,
        onChange: value => onChange(value),
        onFocus: (e: any) => (meta.focus = e)
      };
      break;
    case RadioGroup:
      childProps = {
        onChange: onChange,
        value: value,
        children: children.props.children
      };
      break;
    case "checkbox-group":
      childProps = {
        onChange: onChange,
        value: value,
        children: children.props.children
      };
      break;
    case "camera":
      childProps = {
        onCapture: onChange,
        value: value
      };
      break;
    case "location":
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
  const tStyle = textStyle(props.style);
  const style = { ...props.style };
  if (!!style)
    Object.keys(style).map(k => {
      if (Object.keys(tStyle).indexOf(k) > -1) delete style[k];
    });

  useEffect(() => {
    if (!!isValidate) {
      validation(value);
    }
  }, [isValidate]);
  return (
    <View
      style={{
        zIndex:
          ["select", "date"].indexOf(fieldType) > -1 && meta.focus ? 9 : 1,
        marginBottom: 20,
        marginLeft: 0,
        marginRight: 0,
        overflow: "hidden",
        ..._.get(styles, "root", {}),
        ...style
      }}
    >
      {!!labelText && (
        <Text
          style={{
            fontSize: 14,
            color: theme.primary,
            marginBottom: 5,
            ...((styles && styles.label) || {}),
            ...tStyle
          }}
        >
          {labelText}
        </Text>
      )}
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
          padding: 4,
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
