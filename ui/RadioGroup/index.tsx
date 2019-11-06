import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { uuid } from "../../utils";
import Radio, { RadioProps, RadioModeType } from "../Radio";

export interface RadioGroupProps {
  mode?: RadioModeType;
  value?: any;
  items?: RadioProps[];
  onChange?: (value: any) => void;
  style?: any;
  fieldType?: "radio-group";
}

export default observer((props: RadioGroupProps) => {
  const { items, onChange, value, style, mode } = props;
  return (
    <View style={style}>
      {items.map(item => {
        return (
          <Radio
            text={item.text}
            style={{ marginRight: 15 }}
            onPress={v => {
              onChange && onChange(item.value);
            }}
            checked={item.value == value}
            mode={mode}
            key={uuid()}
          />
        );
      })}
    </View>
  );
});
