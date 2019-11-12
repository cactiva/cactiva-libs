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
  onSubmit?: (data?: any) => void;
}

export default observer((props: FormProps) => {
  const { children, data, setValue, onSubmit } = props;
  const dim = useDimensions().window;
  const meta = useObservable({
    initError: false,
    validate: {}
  });
  const style = {
    zIndex: Platform.OS === "web" ? 9 : 1,
    ..._.get(props, "style", {})
  };

  useEffect(() => {
    children.map(el => {
      if (el.props && el.props.isRequired && el.props.path)
        meta.validate[el.props.path] = false;
    });
  }, []);
  return (
    <KeyboardAvoidingView style={style}>
      {children.map((el: any) => {
        return (
          <RenderChild
            data={data}
            setValue={setValue}
            child={el}
            key={uuid()}
            meta={meta}
            onSubmit={onSubmit}
          />
        );
      })}
      <View style={{ flex: 1 }} />
    </KeyboardAvoidingView>
  );
});

const RenderChild = observer((props: any) => {
  const { data, child, setValue, meta, onSubmit } = props;
  let custProps: any;
  const onPress = () => {
    meta.initError = true;
    let valid = true;
    Object.keys(meta.validate).map(e => {
      if (!meta.validate[e]) valid = false;
    });
    if (valid) onSubmit(data);
  };
  const isValid = value => {
    meta.validate[child.props.path] = value;
  };
  const defaultSetValue = (value: any, path: any) => {
    if (setValue) setValue(value, path);
    else data[path] = value;
    if (meta.initError) meta.initError = false;
  };
  if (child.props.type === "submit") {
    custProps = {
      ...custProps,
      onPress: onPress
    };
  } else {
    custProps = {
      ...custProps,
      isValid: isValid,
      value: data[child.props.path],
      setValue: (value: any) => defaultSetValue(value, child.props.path)
    };
  }
  if (child.props.isRequired) {
    custProps = {
      ...custProps,
      isValidate: meta.initError
    };
  }
  return React.cloneElement(child, {
    ...custProps,
    ...child.props
  });
});
