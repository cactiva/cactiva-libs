import { uuid } from "@src/libs";
import { observer } from "mobx-react-lite";
import React from "react";
import { FlatList, View } from "react-native";
import Field, { FieldProps } from "../field";

export interface FormFieldProps extends FieldProps {
  key: string;
}

export interface FormProps {
  data: any;
  fields: FormFieldProps[];
  setValue?: (value: any, key: any) => void;
  style?: any;
}

export default observer((props: FormProps) => {
  const { data, fields, setValue, style } = props;

  return (
    <View style={style}>
      <FlatList
        data={fields}
        renderItem={({ item }) => {
          return (
            <Field
              {...item}
              value={data[item.key]}
              setValue={v => {
                setValue(v, item.key);
              }}
            />
          );
        }}
        keyExtractor={item => uuid(item.key)}
      />
    </View>
  );
});
