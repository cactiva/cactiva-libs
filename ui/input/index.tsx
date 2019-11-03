import { observer } from "mobx-react-lite";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

export type InputType =
  | "text"
  | "number"
  | "money"
  | "password"
  | "decimal"
  | "multiline";
export interface InputProps extends TextInputProps {
  type?: InputType;
  style?: any;
}

export default observer((props: InputProps) => {
  const { type, onChangeText, value } = props;
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
  let style = { ...styleInput, ...props.style };

  let ComponentProps: TextInputProps = {
    returnKeyType: "next",
    ...props,
    style,
    value: value || "",
    onChangeText: setValue,
    onChange: e => e.stopPropagation()
  };
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
        value: `${value}` || ""
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

const styleInput = {
  borderWidth: 0,
  margin: 0,
  color: "#3a3a3a",
  flexGrow: 1,
  minHeight: 27
};
