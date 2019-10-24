import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Text, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { useNavigation } from "react-navigation-hooks";
import UITextInput, { UITextInputProps } from "./UITextInput";

export interface UIFieldProps {
  label?: string;
  field: UITextInputProps | any;
  style?: any;
  value?: any;
  onChange?: (value: string) => void;
}

export default observer((props: UIFieldProps) => {
  const dim = useDimensions().window;
  const nav = useNavigation();
  const meta = useObservable({
    focus: false
  });
  const { label, field, value, onChange } = props;
  const onFocus = () => {
    meta.focus = !meta.focus;
  };
  const onBlur = () => {
    meta.focus = !meta.focus;
  };

  let component;
  switch (field.type) {
    default:
      component = (
        <UITextInput
          label={label}
          onFocus={onFocus}
          onBlur={onBlur}
          meta={meta}
          value={value}
          onChange={onChange}
          {...field}
        />
      );
      break;
    case "password":
      component = (
        <UITextInput
          label={label}
          onFocus={onFocus}
          onBlur={onBlur}
          meta={meta}
          secureTextEntry
          value={value}
          onChange={onChange}
          {...field}
        />
      );
      break;
  }

  return (
    <View
      style={{
        ...stylesEl.root,
        ...((field.styles && field.styles.root) || {})
      }}
    >
      <Text
        style={{
          ...stylesEl.label,
          ...((field.styles && field.styles.label) || {})
        }}
      >
        {meta.focus ? label : " "}
      </Text>
      {component}
    </View>
  );
});

const stylesEl: any = {
  root: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    paddingLeft: 5,
    paddingRight: 5,
    color: "#4C5487"
  }
};
