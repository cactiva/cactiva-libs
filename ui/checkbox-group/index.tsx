import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import Checkbox from "../checkbox";
import { uuid } from "../../utils";
import { RadioProps } from "../radio";

export interface CheckboxGroupProps {
  value?: string[];
  items?: RadioProps[];
  onChange?: (value: any) => void;
  style?: any;
}

export default observer((props: CheckboxGroupProps) => {
  const { items, onChange, value, style } = props;

  return (
    <View style={style}>
      {items.map(item => {
        return (
          <Checkbox
            text={item.text}
            style={{ marginRight: 15 }}
            onPress={v => {
              if (v) {
                value.push(item.value);
              } else {
                let i = value.findIndex(v => v == item.value);
                value.splice(i, 1);
              }
              onChange && onChange(getUnique(value));
            }}
            checked={value.findIndex(v => v == item.value) > -1}
            key={uuid()}
          />
        );
      })}
    </View>
  );
});

function getUnique(array) {
  var uniqueArray = [];
  for (let i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
}
