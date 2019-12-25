import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Platform, ViewProps, Text } from "react-native";
import { useDimensions } from "react-native-hooks";
import { ThemeProps } from "../../theme";
import { uuid } from "../../utils";
import Field from "../Field";
import View from "../View";
import { toJS } from "mobx";

export interface FormProps extends ViewProps {
  data?: any;
  setValue?: (value: any, path: any) => void;
  children?: any;
  theme?: ThemeProps;
  onSubmit?: (data?: any) => void;
  onFieldFunction?: (data?: any) => void;
}

export default observer((props: FormProps) => {
  const { children, data, setValue, onSubmit, onFieldFunction } = props;
  const dim = useDimensions().window;
  const meta = useObservable({
    initError: false,
    validate: {}
  });
  const style = {
    // zIndex: Platform.OS === "web" ? 9 : 1,
    ...(_.get(props, "style", {}) as any)
  };

  useEffect(() => {
    if (meta.initError) {
      let valid = true;
      Object.keys(meta.validate).map(e => {
        if (!meta.validate[e]) valid = false;
      });
      if (meta.initError && valid && onSubmit) {
        onSubmit(data);
      }
    }
  }, [meta.initError, meta.validate]);

  useEffect(() => {
    if (children) {
      if (Array.isArray(children)) {
        children.map(el => {
          if (el.props && el.props.isRequired && el.props.path)
            meta.validate[el.props.path] = false;
        });
      } else {
        if (children.props && children.props.isRequired && children.props.path)
          meta.validate[children.props.path] = false;
      }
    }
  }, []);
  return (
    <View
      type={"ScrollView"}
      style={{
        flexGrow: 1,
        ...style
      }}
      keyboardShouldPersistTaps={"handled"}
      keyboardDismissMode={"on-drag"}
    >
      {children && Array.isArray(children) ? (
        children.map((el: any) => {
          return (
            <RenderChild
              data={data}
              setValue={setValue}
              child={el}
              key={uuid()}
              meta={meta}
              onFieldFunction={onFieldFunction}
              onSubmit={onSubmit}
            />
          );
        })
      ) : (
        <RenderChild
          data={data}
          setValue={setValue}
          child={children}
          key={uuid()}
          meta={meta}
          onFieldFunction={onFieldFunction}
          onSubmit={onSubmit}
        />
      )}
    </View>
  );
});

const RenderChild = observer((props: any) => {
  const { data, child, setValue, meta, onSubmit, onFieldFunction } = props;
  if (!child || !child.type || !child.props) {
    return child;
  }
  const onPress = e => {
    meta.initError = true;
    let valid = true;
    Object.keys(meta.validate).map(e => {
      if (!meta.validate[e]) valid = false;
    });
    if (meta.initError && valid && onSubmit) {
      onSubmit(data);
    }
  };

  const defaultSetValue = (value: any, path: any) => {
    if (!!setValue) setValue(value, path);
    else {
      if (data) {
        _.set(data, path, value);
      } else {
        console.error("Failed to set value: Form data props is undefined");
      }
    }
    if (meta.initError) meta.initError = false;
  };

  if (typeof child.props.children === "function") {
    let fc = null;

    if (onFieldFunction) {
      fc = onFieldFunction(
        child.props.children,
        _.get(data, child.props.path, []),
        defaultSetValue,
        child.props.path
      );
    } else {
      fc = child.props.children(_.get(data, child.props.path, []));
    }

    return React.cloneElement(child, {
      ...child.props,
      children: fc
    });
  } else if (child.type === Field) {
    let custProps: any;
    const isValid = value => {
      meta.validate[child.props.path] = value;
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
    } else if (child.props) {
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
