import Theme from "@src/theme.json";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SelectProps } from ".";
import { DefaultTheme } from "../../theme";
import { fuzzyMatch } from "../../utils";
import Icon from "../Icon";
import Input from "../Input";

export default observer((props: SelectProps) => {
  const { value, placeholder, items, style, onFocus } = props;
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  const meta = useObservable({
    isShown: false,
    value: null,
    filter: "",
    scrollH: 0,
    dimensions: null,
    contentHeight: 0
  });

  const onSearch = value => {
    meta.filter = value || "";
  };
  useEffect(() => {
    if (value)
      meta.value = items.find(x =>
        typeof x === "string" ? x === value : x.value === value
      );
  }, []);

  useEffect(() => {
    onFocus && onFocus(meta.isShown as any);
  }, [meta.isShown]);

  return (
    <>
      <div
        style={{
          position: "initial",
          zIndex: meta.isShown ? 9 : 0,
          minHeight: 30,
          ...style
        }}
        ref={(ref: any) => {
          if (ref) {
            const dimensions = ref.getBoundingClientRect();
            const parentDimension = ref.parentElement.parentElement.parentElement.getBoundingClientRect();
            meta.dimensions = dimensions;
            meta.scrollH = parentDimension.bottom;
          }
        }}
      >
        {meta.isShown && items && items.length > 5 ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between"
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
                marginTop: 0,
                flex: 1
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
                if (items && items.length > 0) meta.isShown = !meta.isShown;
              }}
            >
              <Icon
                source="Entypo"
                name={meta.isShown ? "chevron-up" : "chevron-down"}
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
                  color: value ? "#3a3a3a" : "#757575"
                }}
              >
                {meta.value
                  ? typeof meta.value === "string"
                    ? meta.value
                    : meta.value.text
                  : placeholder}
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
                name={meta.isShown ? "chevron-up" : "chevron-down"}
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
  const [loaded, setLoaded] = useState(false);
  const rootPortal = document.getElementById("root-portal");
  useEffect(() => {
    const iv = setInterval(() => {
      const rootPortal = document.getElementById("root-portal");
      if (rootPortal) {
        setLoaded(true);
        clearInterval(iv);
      }
    }, 100);
  }, []);
  if (!loaded! || !meta.isShown) return null;
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: meta.dimensions.top,
        left: meta.dimensions.left,
        minHeight: 40,
        marginTop: 28,
        maxHeight: 250,
        backgroundColor: "#fff",
        width: meta.dimensions.width,
        zIndex: 9,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: theme.light,
        borderStyle: "solid",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.16)"
      }}
    >
      <RenderItem {...props} meta={meta} theme={theme} />
    </div>,
    rootPortal
  );
});

const RenderItem = observer((props: any) => {
  const { meta, items, value, onSelect, theme } = props;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ width: meta.dimensions.width }}
    >
      <FlatList
        data={(items || []).filter((item: any) => {
          if (meta.filter && meta.filter.length > 0)
            return fuzzyMatch(
              meta.filter.toLowerCase(),
              (typeof item === "string" ? item : item.text).toLowerCase()
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
              textAlign: "center",
              fontSize: 12
            }}
          >
            No item to display.
          </Text>
        )}
        renderItem={({ item }) => {
          const textLabel = typeof item === "string" ? item : item.text;
          const textValue = typeof item === "string" ? item : item.value;
          const active = value === textValue && !!textValue;
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                meta.isShown = false;
                meta.value = item;
              }}
              style={{
                paddingRight: 5,
                paddingLeft: 5,
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
    </ScrollView>
  );
});
