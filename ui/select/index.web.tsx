import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { DefaultTheme, ThemeProps } from "../../theme";
import { fuzzyMatch } from "../../utils";
import Icon from "../icon";
import Input, { InputProps } from "../input";
import { SelectProps } from ".";

export default observer((props: SelectProps) => {
  const { value, placeholder, items, style, onFocus } = props;
  const theme = DefaultTheme;
  const meta = useObservable({
    isShown: false,
    value: null,
    filter: "",
    position: "",
    scrollH: 0
  });

  const onSearch = value => {
    meta.filter = value;
  };
  useEffect(() => {
    if (value) meta.value = items.find(x => x.value === value);
  }, []);

  useEffect(() => {
    onFocus && onFocus(meta.isShown as any);
  }, [meta.isShown]);

  return (
    <>
      <div
        style={{
          flex: 1,
          position: "initial",
          zIndex: meta.isShown ? 9 : 0
        }}
        ref={(ref: any) => {
          if (ref) {
            const dimensions = ref.getBoundingClientRect();
            const parentDimension = ref.parentElement.parentElement.parentElement.getBoundingClientRect();
            if (dimensions.top - 250 > 0) {
              meta.position = "top";
            } else {
              meta.position = "bottom";
            }
            meta.scrollH = parentDimension.bottom;
          }
        }}
      >
        {meta.isShown && items.length > 5 ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
              ...style
            }}
          >
            <Input
              value={meta.filter}
              onChangeText={onSearch}
              placeholder={
                meta.value ? meta.value.text : placeholder || "Search"
              }
              autoFocus={true}
              style={{
                backgroundColor: theme.light,
                minHeight: 27,
                maxHeight: 27,
                paddingLeft: 5,
                paddingRight: 5,
                marginTop: 0
              }}
            />
            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 5,
                paddingRight: 5
              }}
              onPress={e => {
                e.stopPropagation();
                e.preventDefault();
                meta.isShown = !meta.isShown;
              }}
            >
              <Icon
                source="Entypo"
                name={meta.isShown ? "chevron-down" : "chevron-up"}
                color={theme.dark}
                size={20}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
              ...style
            }}
            onPress={e => {
              e.stopPropagation();
              e.preventDefault();
              meta.isShown = !meta.isShown;
            }}
          >
            <View
              style={{
                flex: 1
              }}
            >
              <Text
                style={{
                  flex: 1,
                  marginTop: 5,
                  marginBottom: 5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  color: value ? "#3a3a3a" : "#757575"
                }}
              >
                {meta.value ? meta.value.text : placeholder}
              </Text>
            </View>
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
                name={meta.isShown ? "chevron-down" : "chevron-up"}
                color="#3a3a3a"
                size={20}
              />
            </View>
          </TouchableOpacity>
        )}
        <ModalItems meta={meta} {...props} theme={theme} />
      </div>
      {meta.isShown && (
        <div
          onClickCapture={e => {
            e.stopPropagation();
            e.preventDefault();
            meta.isShown = false;
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            bottom: 0,
            height: meta.scrollH,
            display: "flex"
          }}
        />
      )}
    </>
  );
});

const ModalItems = observer((props: any) => {
  const { meta, theme } = props;
  return (
    <>
      {meta.isShown && (
        <div
          style={{
            position: "absolute",
            bottom: meta.position === "top" ? 35 : null,
            top: meta.position === "bottom" ? 35 : null,
            left: 0,
            right: 0,
            minHeight: 40,
            maxHeight: 250,
            backgroundColor: "#fff",
            zIndex: 9,
            borderTopLeftRadius: meta.position === "top" ? 8 : 0,
            borderTopRightRadius: meta.position === "top" ? 8 : 0,
            borderBottomLeftRadius: meta.position === "bottom" ? 8 : 0,
            borderBottomRightRadius: meta.position === "bottom" ? 8 : 0,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-start",
            borderWidth: 1,
            borderColor: theme.light,
            borderStyle: "solid",
            borderTopWidth: meta.position === "top" ? 1 : 0,
            borderBottomWidth: meta.position === "bottom" ? 1 : 0,
            padding: 5,
            boxShadow: "0px 9px 10px #d4d4d4"
          }}
        >
          <RenderItem {...props} meta={meta} theme={theme} />
        </div>
      )}
    </>
  );
});

const RenderItem = observer((props: any) => {
  const { meta, items, value, onSelect, theme } = props;

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
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
          return `select-${item.value}`;
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
          const active = value === item.value;
          return (
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                e.preventDefault();
                onSelect(item);
                meta.isShown = false;
                meta.value = item;
              }}
              style={{
                paddingRight: 10,
                paddingLeft: 10,
                minHeight: 35,
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
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
});
