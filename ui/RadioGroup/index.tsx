import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { uuid } from "../../utils";
import { RadioModeType } from "../Radio";

export interface RadioGroupProps {
  mode?: RadioModeType;
  value?: any;
  onChange?: (value: any) => void;
  style?: any;
  fieldType?: "radio-group";
  children?: any;
}

export default observer((props: RadioGroupProps) => {
  const { onChange, value, style, mode, children } = props;

  return (
    <View style={style}>
      {children.map((el: any) => {
        return (
          <RenderChild
            onPress={v => {
              onChange && onChange(el.props.value || el.props.text);
            }}
            checked={(el.props.value === value || el.props.text === value) && !!value}
            mode={mode}
            children={el}
            key={uuid()}
          />
        );
      })}
    </View>
  );
});

const RenderChild = observer((props: any) => {
  const { children, onPress, checked, mode } = props;

  return React.cloneElement(children, {
    checked,
    mode,
    onPress,
    ...children.props
  });
});
