import _ from "lodash";
import { observer } from "mobx-react-lite";
import React from "react";
import { Platform, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import { FieldProps } from "../Field";

export interface FormFieldProps extends FieldProps {
  key: string;
}

export interface FormProps {
  data: any;
  setValue?: (value: any, path: any) => void;
  children?: any;
  style?: any;
  theme?: ThemeProps;
}

export default observer((props: FormProps) => {
  const { data, setValue, children } = props;
  const dim = useDimensions().window;
  const platform =
    dim.width > 780 && Platform.OS === "web" ? "desktop" : "mobile";
  const style = {
    zIndex: Platform.OS === "web" ? 9 : 1,
    ...(platform === "desktop" ? styleFormDesktop : styleFormMobile),
    ..._.get(props, "style", {})
  };
  const defaultSetValue = (value: any, path: any) => {
    data[path] = value;
    setValue && setValue(value, path);
  };
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, {
      value: data[child.props.path],
      setValue: (value: any) => defaultSetValue(value, child.props.path),
      ...child.props
    })
  );
  return <View style={style}>{childrenWithProps}</View>;
});

const styleFormDesktop = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "stretch",
  justifyContent: "space-between"
};

const styleFormMobile = {
  display: "flex",
  flexDirection: "column"
};
