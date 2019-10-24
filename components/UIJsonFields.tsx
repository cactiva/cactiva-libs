import { uuid } from "@src/libs";
import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { UIFieldProps } from "./UIField";
import UITextInput, { UITextInputProps } from "./UITextInput";

interface UIFields {
  [key: string]: UIFieldProps | UITextInputProps | any;
}

export interface UIJsonFieldsProps {
  items: any;
  fields: UIFields[];
  setValue?: (value: any, key: any) => void;
  style?: object;
  theme?: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
    accent: string;
  };
}

export default observer((props: UIJsonFieldsProps) => {
  const { items, fields, setValue, style, theme } = props;

  return (
    <View style={style}>
      {fields.map((field: any) => {
        return (
          <GenerateField
            key={uuid()}
            setValue={setValue}
            field={field}
            items={items}
            theme={theme}
          />
        );
      })}
    </View>
  );
});

const GenerateField = observer((props: any) => {
  const { field, items, setValue, theme } = props;
  const onChange = value => {
    switch (field.field.type) {
      case "number":
        value = !!value ? parseInt(value) : value;
        break;
    }
    setValue(value, field.key);
  };

  let Component;
  switch (field.type) {
    default:
      Component = (
        <UITextInput
          value={items[field.key]}
          onChange={onChange}
          label={field.label}
          theme={theme}
          {...field.field}
        />
      );
      break;
  }
  return Component;
});
