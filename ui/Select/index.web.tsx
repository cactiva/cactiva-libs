import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SelectProps } from ".";
import { DefaultTheme } from "../../theme";
import { fuzzyMatch } from "../../utils";
import Icon from "../Icon";
import Input from "../Input";

export default observer((props: SelectProps) => {
  const { value, placeholder, items, style, onFocus } = props;
  const theme = DefaultTheme;
  const meta = useObservable({
    isShown: false,
    value: null,
    filter: "",
    scrollH: 0,
    dimensions: null,
    contentHeight: 0
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
          position: "initial",
          zIndex: meta.isShown ? 9 : 0,
          minWidth: 147,
          ...style
        }}
        ref={(ref: any) => {
          if (ref && !meta.dimensions) {
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
  const getPosition = () => {
    if (meta.dimensions && meta.contentHeight > 0) {
      if (
        meta.dimensions.bottom + meta.contentHeight <= meta.scrollH ||
        (meta.scrollH - (meta.dimensions.top + meta.contentHeight) < 0 &&
          meta.dimensions.bottom < meta.scrollH / 4)
      ) {
        return "bottom";
      } else {
        return "top";
      }
    }
    return null;
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bottom: getPosition() === "top" ? meta.dimensions.height : null,
        top: getPosition() === "bottom" ? 0 : null,
        left: 0,
        right: 0
      }}
    >
      {meta.isShown && (
        <div
          ref={(ref: any) => {
            if (ref && meta.contentHeight === 0) {
              const dimensions = ref.getBoundingClientRect();
              meta.contentHeight = dimensions.height;
            }
          }}
          style={{
            position: "absolute",
            bottom: getPosition() === "top" ? 0 : null,
            top: getPosition() === "bottom" ? 0 : null,
            left: 0,
            right: 0,
            minHeight: 40,
            maxHeight: 250,
            backgroundColor: "#fff",
            width: meta.dimensions.width,
            zIndex: 9,
            borderTopLeftRadius: getPosition() === "top" ? 8 : 0,
            borderTopRightRadius: getPosition() === "top" ? 8 : 0,
            borderBottomLeftRadius: getPosition() === "bottom" ? 8 : 0,
            borderBottomRightRadius: getPosition() === "bottom" ? 8 : 0,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-start",
            borderWidth: 1,
            borderColor: theme.light,
            borderStyle: "solid",
            borderTopWidth: getPosition() === "top" ? 1 : 0,
            borderBottomWidth: getPosition() === "bottom" ? 1 : 0,
            boxShadow:
              getPosition() === "top"
                ? "0px -4px 5px rgba(0, 0, 0, 0.16)"
                : "0px 4px 5px rgba(0, 0, 0, 0.16)",
            opacity: !!getPosition() && meta.isShown ? 1 : 0
          }}
        >
          <RenderItem {...props} meta={meta} theme={theme} />
        </div>
      )}
    </div>
  );
});

const RenderItem = observer((props: any) => {
  const { meta, items, value, onSelect, theme } = props;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ margin: 5, width: meta.dimensions.width }}
    >
      <FlatList
        data={(items || []).filter((item: any) => {
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
              textAlign: "center",
              fontSize: 12
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
