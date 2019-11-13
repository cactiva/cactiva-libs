import { observer } from "mobx-react-lite";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import _ from 'lodash';
export type InputType =
  | "text"
  | "number"
  | "money"
  | "password"
  | "decimal"
  | "multiline";
export interface InputProps extends TextInputProps {
  fieldType?: "input";
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

  const cprops = { ...props };
  delete cprops.fieldType;
  let ComponentProps: TextInputProps = {
    returnKeyType: "next",
    ...cprops,
    style,
    value: value || "",
    placeholder: _.get(cprops, 'placeholder', ''),
    onChangeText: setValue
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

const styleInput = {
  borderWidth: 0,
  margin: 0,
  color: "#3a3a3a",
  minHeight: 27
};
