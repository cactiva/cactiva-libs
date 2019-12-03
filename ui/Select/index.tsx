import Theme from "@src/theme.json";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { TouchableOpacity, Platform } from "react-native";
import { DefaultTheme, ThemeProps } from "../../theme";
import { fuzzyMatch, textStyle } from "../../utils";
import Header from "../Header";
import Icon from "../Icon";
import Input from "../Input";
import View from "../View";
import Text from "../Text";
import Modal from "../Modal";
import FlatList from "../FlatList";
import _ from "lodash";
import { processData } from "./index.web";

export interface SelectItemProps {
  text: any;
  value: any;
}

export interface SelectProps {
  value?: any;
  placeholder?: string;
  items: (SelectItemProps | string)[];
  onSelect?: (item: any) => void;
  style?: any;
  theme?: ThemeProps;
  onFocus?: (e: any) => void;
  readonly?: boolean;
  textPath?: string;
  valuePath?: string;
}


export default observer((props: SelectProps) => {
  const { value, placeholder, readonly } = props;
  const meta = useObservable({
    isShown: false,
    value: null,
    items: props.items as any,
    filter: ""
  });

  useEffect(() => {
    meta.items = processData(props);
  }, [props.items])

  const items = meta.items;

  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };

  const tStyle = textStyle(props.style);
  const style = { ...props.style };
  if (!!style)
    Object.keys(style).map(k => {
      if (Object.keys(tStyle).indexOf(k) > -1) delete style[k];
    });

  useEffect(() => {
    if (value && Array.isArray(items))
      meta.value = items.find(x =>
        typeof x === "string" ? x === value : x.value === value
      );
  }, []);

  return (
    <>
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          ...style
        }}
        disabled={readonly}
        onPress={() =>
          (meta.isShown = items && items.length > 0 ? true : false)
        }
      >
        <Text
          style={{
            flex: 1,
            paddingLeft: 5,
            marginTop: Platform.OS === "ios" ? 6 : 5,
            marginBottom: Platform.OS === "ios" ? 7 : 5,
            fontSize: Theme.fontSize,
            color: value ? "#3a3a3a" : "#757575",
            ...tStyle
          }}
        >
          {meta.value
            ? typeof meta.value === "string"
              ? meta.value
              : meta.value.text
            : placeholder}
        </Text>
        {!readonly && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 5,
              paddingRight: 5
            }}
          >
            <Icon
              source="Entypo"
              name={meta.isShown ? "chevron-up" : "chevron-down"}
              color={theme.dark}
              size={24}
            />
          </View>
        )}
      </TouchableOpacity>
      <ModalItems meta={meta} {...props} items={items} theme={theme} />
    </>
  );
});

const ModalItems = observer((props: any) => {
  const { meta, theme } = props;
  const onSearch = value => {
    meta.filter = value;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={meta.isShown}
      onRequestClose={() => (meta.isShown = false)}
    >
      <View
        type={"SafeAreaView"}
        style={{
          backgroundColor: "#fff",
          flexGrow: 1,
          flexShrink: 1
        }}
      >
        <Header
          safeAreaView={true}
          backBtn={true}
          onPressBackBtn={() => (meta.isShown = false)}
          title={
            <Input
              placeholder={props.placeholder || "Search..."}
              value={meta.filter}
              onChangeText={onSearch}
              style={{
                padding: 10
              }}
            />
          }
          style={{
            paddingTop: 0
          }}
        ></Header>
        <RenderItem {...props} meta={meta} theme={theme} />
      </View>
    </Modal>
  );
});

const RenderItem = observer((props: any) => {
  const { meta, items, value, onSelect, theme } = props;
  return (
    <View type={"ScrollView"} keyboardShouldPersistTaps="handled">
      <FlatList
        data={items.filter((item: any) => {
          if (meta.filter.length > 0)
            return fuzzyMatch(
              meta.filter.toLowerCase(),
              item.text.toLowerCase()
            );
          return true;
        })}
        keyExtractor={(item: any) => {
          return `select-${typeof item === "string" ? item : item.value}`;
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: theme.light,
              borderWidth: 0
            }}
          />
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              margin: 10,
              textAlign: "center"
            }}
          >
            No item to display.
          </Text>
        )}
        renderItem={({ item }) => {
          const textLabel = typeof item === "string" ? item : item.text;
          const textValue = typeof item === "string" ? item : item.value;
          let active = false;
          if (value && value.value) {
            active = value.value === textValue && !!textValue;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                meta.isShown = false;
                meta.value = item;
              }}
              style={{
                paddingRight: 10,
                paddingLeft: 10,
                minHeight: 40,
                display: "flex",
                justifyContent: "center",
                backgroundColor: active ? theme.primary : "#fff"
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : theme.dark
                }}
              >
                {textLabel}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
});
