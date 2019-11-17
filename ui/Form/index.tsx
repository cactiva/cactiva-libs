import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Platform, View, KeyboardAvoidingView } from "react-native";
import { useDimensions } from "react-native-hooks";
import { ThemeProps } from "../../theme";
import Field, { FieldProps } from "../Field";
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
  if (!child) {
    return null;
  }
  const onPress = (e) => {
    meta.initError = true;
    let valid = true;
    Object.keys(meta.validate).map(e => {
      if (!meta.validate[e]) valid = false;
    });
    if (child.props.onPress) {
      child.props.onPress(e);
    }
    if (valid && onSubmit) onSubmit(data);
  };

  if (child.type === Field) {
    let custProps: any;
    const isValid = value => {
      meta.validate[child.props.path] = value;
    };
    const defaultSetValue = (value: any, path: any) => {
      if (setValue) setValue(value, path);
      else {
        if (data) {
          _.set(data, path, value);
        } else {
          console.error('Failed to set value: Form data props is undefined')
        }
      };
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
        value: _.get(data, child.props.path),
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
  } else {
    const childrenRaw = _.get(child, "props.children");
    const hasChildren = !!childrenRaw;
    if (!hasChildren) {
      return child;
    } else {
      const children = Array.isArray(childrenRaw) ? childrenRaw : [childrenRaw];
      const props = { ...child.props };
      if (child.props.type === "submit") {
        props.onPress = onPress;
      }
      return React.cloneElement(child, {
        ...props,
        children: children.map(el => (
          <RenderChild
            data={data}
            setValue={setValue}
            child={el}
            key={uuid()}
            meta={meta}
            onSubmit={onSubmit}
          />
        ))
      });
    }
  }
});
