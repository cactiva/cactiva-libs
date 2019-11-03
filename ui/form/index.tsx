import _ from "lodash";
import { observer } from "mobx-react-lite";
import React from "react";
import { Platform, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import { uuid } from "../../utils";
import Field, { FieldProps } from "../field";

export interface FormFieldProps extends FieldProps {
  key: string;
}

export interface FormProps {
  data: any;
  fields: FormFieldProps[];
  setValue?: (value: any, key: any) => void;
  children?: any;
  style?: any;
  theme?: ThemeProps;
}

export default observer((props: FormProps) => {
  const { data, fields, setValue, children } = props;
  const dim = useDimensions().window;
  const platform =
    dim.width > 780 && Platform.OS === "web" ? "desktop" : "mobile";
  const theme = {
    ...DefaultTheme,
    ..._.get(props, "theme", {})
  };
  const style = {
    ...(platform === "desktop" ? styleFormDesktop : styleFormMobile),
    ..._.get(props, "style", {})
  };
  return (
    <View style={style}>
      {fields.map(item => {
        return (
          <RenderField
            item={item}
            setValue={setValue}
            data={data}
            theme={theme}
            key={uuid()}
          />
        );
      })}
      {children}
    </View>
  );
});

const RenderField = observer((props: any) => {
  const { theme, item, setValue, data } = props;
  return (
    <Field
      theme={theme}
      {...item}
      value={data[item.key]}
      setValue={v => {
        setValue(v, item.key);
      }}
    />
  );
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
