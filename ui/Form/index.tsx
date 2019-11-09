import _ from "lodash";
import { observer } from "mobx-react-lite";
import React from "react";
import { Platform, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { ThemeProps } from "../../theme";
import { FieldProps } from "../Field";
import { uuid } from "../../utils";

export interface FormFieldProps extends FieldProps {
  key: string;
}

export interface FormProps {
  data?: any;
  setValue?: (value: any, path: any) => void;
  children?: any;
  style?: any;
  theme?: ThemeProps;
}

export default observer((props: FormProps) => {
  const { children, data, setValue } = props;
  const dim = useDimensions().window;
  const style = {
    zIndex: Platform.OS === "web" ? 9 : 1,
    ..._.get(props, "style", {})
  };

  return (
    <View style={style}>
      {children.map((el: any) => {
        return (
          <RenderChild
            data={data}
            setValue={setValue}
            children={el}
            key={uuid()}
          />
        );
      })}
    </View>
  );
});

const RenderChild = observer((props: any) => {
  const { data, children, setValue } = props;
  const defaultSetValue = (value: any, path: any) => {
    if (setValue) setValue(value, path);
    else data[path] = value;
  };
  return React.cloneElement(children, {
    value: data[children.props.path],
    setValue: (value: any) => defaultSetValue(value, children.props.path),
    ...children.props
  });
});