import { observer } from "mobx-react-lite";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

export interface UITextInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value?: any;
  type?: "text" | "number" | "money" | "password" | "decimal" | "multiline";
  onChange: (value) => void;
  style?: any;
  [key: string]: any;
}

export default observer((props: UITextInputProps) => {
  const { label, placeholder, style, onChange, type, meta } = props;
  const onChangeText = (e: any) => {
    let v;
    switch (type) {
      default:
        v = e;
        break;
      case "number":
        v = e.replace(/\D/g, "");
        break;
    }
    meta.value = v;
    onChange && onChange(meta.value);
  };
  const onFocus = () => {
    meta.focus = !meta.focus;
  };
  const onBlur = () => {
    meta.focus = !meta.focus;
  };

  let ComponentProps;
  switch (type) {
    default:
      ComponentProps = {
        placeholder: meta.focus ? "" : label || placeholder,
        style: {
          ...styleInput,
          ...style
        },
        value: meta.value || "",
        onChangeText: onChangeText,
        onFocus: onFocus,
        onBlur: onBlur,
        returnKeyType: "next"
      };
      break;
    case "password":
      ComponentProps = {
        placeholder: meta.focus ? "" : label || placeholder,
        style: {
          ...styleInput,
          ...style
        },
        value: meta.value || "",
        onChangeText: onChangeText,
        onFocus: onFocus,
        onBlur: onBlur,
        returnKeyType: "next",
        secureTextEntry: true
      };
      break;
    case "decimal":
    case "number":
      ComponentProps = {
        placeholder: meta.focus ? "" : label || placeholder,
        style: {
          ...styleInput,
          ...style
        },
        value: `${meta.value}` || "",
        onChangeText: onChangeText,
        onFocus: onFocus,
        onBlur: onBlur,
        returnKeyType: "next",
        keyboardType: "number-pad"
      };
      break;
    case "multiline":
      ComponentProps = {
        placeholder: meta.focus ? "" : label || placeholder,
        style: {
          ...styleInput,
          ...style
        },
        value: meta.value || "",
        onChangeText: onChangeText,
        onFocus: onFocus,
        onBlur: onBlur,
        returnKeyType: "next",
        multiline: true,
        numberOfLines: 4
      };
      break;
  }

  return <TextInput {...ComponentProps} />;
});

const styleInput = {
  borderWidth: 0,
  marginTop: 5,
  marginRight: 0,
  marginBottom: 5,
  marginLeft: 0,
  color: "#3a3a3a",
  display: "flex",
  flexGrow: 1
};
