import Theme from "@src/theme.json";
import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { DefaultTheme } from "../../theme";
import Text from "../Text";
import NiceValue from "./NiceValue";

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
  const originalType = useRef(type);
  const setValue = (e: any) => {
    let v;
    switch (originalType.current) {
      default:
        v = e;
        break;
      case "number":
        v = parseInt(e);
        break;
      case "decimal":
        v = parseFloat(e);
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

  const cprops = { ...props, onChangeText: setValue };

  if (typeof value === "number" && type !== "number" && type !== "decimal") {
    originalType.current = "number";
    value = !!value ? String(value) : "";
  }
  let ComponentProps: TextInputProps = {
    returnKeyType: "next",
    ...cprops,
    style,
    value: !!value ? value : "",
    placeholder: _.get(cprops, "placeholder", "")
  };

  if (!!value && typeof value === "object") {
    return <NiceValue value={value} />;
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
        value: !!value ? String(value) : ""
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
