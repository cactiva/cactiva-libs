import Theme from "@src/theme.json";
import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { DefaultTheme } from "../../theme";
import Text from "../Text";

export type InputType =
  | "text"
  | "number"
  | "money"
  | "password"
  | "decimal"
  | "multiline";
export interface InputProps extends TextInputProps {
  type?: InputType;
}

export default observer((props: InputProps) => {
  let { type, onChangeText, value } = props;
  const setValue = (e: any) => {
    let v;
    switch (type) {
      default:
        v = e;
        break;
      case "number":
        v = e.replace(/\D/g, "");
        break;
    }
    onChangeText && onChangeText(v);
  };
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  let style = {
    minWidth: 10,
    borderWidth: 0,
    margin: 0,
    color: theme.dark,
    minHeight: 30,
    fontSize: Theme.fontSize,
    ...(_.get(props, "style", {}) as any)
  };

  const cprops = { ...props };
  let ComponentProps: TextInputProps = {
    returnKeyType: "next",
    ...cprops,
    style,
    value: value || "",
    placeholder: _.get(cprops, "placeholder", ""),
    onChange: (e:any) => {
      setValue(e.target.value)
    }
  };

  if (typeof value === 'number') {
    type = 'number';
  }
  if (typeof value === "object") {
    return <Text>{JSON.stringify(value)}</Text>;
  }

  switch (type) {
    case "password":
      ComponentProps = {
        ...ComponentProps,
        secureTextEntry: true
      };
      break;
    case "decimal":
    case "number":
      ComponentProps = {
        keyboardType: "number-pad",
        ...ComponentProps,
        value: value ? `${value}` : ""
      };
      break;
    case "multiline":
      ComponentProps = {
        numberOfLines: 4,
        ...ComponentProps,
        multiline: true
      };
      break;
  }
  return <TextInput {...ComponentProps} />;
});
