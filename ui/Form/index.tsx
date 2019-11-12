import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Platform, View, KeyboardAvoidingView } from "react-native";
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
  onSubmit?: () => void;
}

export default observer((props: FormProps) => {
  const { children, data, setValue } = props;
  const dim = useDimensions().window;
  const meta = useObservable({
    validate: false,
    valid: []
  });
  const style = {
    zIndex: Platform.OS === "web" ? 9 : 1,
    ..._.get(props, "style", {})
  };
  useEffect(() => {
    const clength = children.length;
    if (meta.valid.length >= clength) {
      let s = meta.valid.splice(
        meta.valid.length - clength - 1,
        meta.valid.length - 1
      );
      console.log(s);
    }
  }, [meta.valid]);
  return (
    <KeyboardAvoidingView style={style}>
      {children.map((el: any) => {
        return (
          <RenderChild
            data={data}
            setValue={setValue}
            children={el}
            key={uuid()}
            meta={meta}
          />
        );
      })}
      <View style={{ flex: 1 }} />
    </KeyboardAvoidingView>
  );
});

const RenderChild = observer((props: any) => {
  const { data, children, setValue, meta } = props;
  let custProps: any;
  const onSubmit = () => {
    meta.validate = true;
  };
  const defaultSetValue = (value: any, path: any) => {
    if (setValue) setValue(value, path);
    else data[path] = value;
    if (meta.validate) meta.validate = false;
  };
  if (children.props.type === "submit") {
    custProps = {
      ...custProps,
      onPress: onSubmit
    };
  } else {
    custProps = {
      ...custProps,
      value: data[children.props.path],
      setValue: (value: any) => defaultSetValue(value, children.props.path)
    };
  }
  if (children.props.isRequired) {
    custProps = {
      ...custProps,
      isValidate: meta.validate
    };
  }
  return React.cloneElement(children, {
    ...custProps,
    ...children.props
  });
});
