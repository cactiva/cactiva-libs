import { uuid } from "../utils";
import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import UIField from "./UIField";
import { UITextInputProps } from "./UITextInput";

export interface UIJsonFieldsProps {
  items: any;
  fields: UITextInputProps | any[];
  setValue?: (value: any, key: any) => void;
  style?: object;
  theme?: any;
}

export default observer((props: UIJsonFieldsProps) => {
  const { items, fields, setValue, style, theme } = props;

  return (
    <View style={style}>
      {fields.map((field: any) => {
        return (
          <UIField
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
