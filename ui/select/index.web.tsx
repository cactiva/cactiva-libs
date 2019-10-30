import React, { useEffect, useRef } from "react";
import { observer, useObservable } from "mobx-react-lite";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  Modal
} from "react-native";
import Icon from "../icon";
import Input, { InputProps } from "../input";
import { useDimensions } from "react-native-hooks";
import { uuid, fuzzyMatch } from "../../utils";
import { DefaultTheme, ThemeProps } from "../../theme";
import Dropdown from "react-dropdown";

export interface SelectItemProps {
  text: any;
  value: any;
}

export interface SelectProps extends InputProps {
  items: SelectItemProps[];
  onSelect: (item: any) => void;
  theme?: ThemeProps;
}

export default observer((props: SelectProps) => {
  const { value, placeholder, items, style } = props;
  const meta = useObservable({
    isShown: false,
    value: null,
    filter: "",
    position: {
      top: 0,
      bottom: 0,
      pH: 0,
      dH: 0,
      y: 0,
      ready: false
    }
  });
  useEffect(() => {
    if (value) meta.value = items.find(x => x.value === value);
  }, []);
  return (
    <>
      <TouchableOpacity
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          ...style
        }}
        onPress={() => {
          meta.isShown = !meta.isShown;
          !meta.isShown && (meta.position.ready = false);
        }}
        onLayout={(layout: any) => {
          meta.position.pH =
            layout.nativeEvent.target.parentElement.offsetHeight;
          meta.position.y = layout.nativeEvent.layout.y;
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
          <Icon source="Entypo" name="chevron-up" color="#3a3a3a" size={20} />
        </View>
      </TouchableOpacity>
      <ModalItems meta={meta} {...props} />
    </>
  );
});

const ModalItems = observer((props: any) => {
  const { meta, placeholder, items, value, onSelect, ref } = props;
  const theme = DefaultTheme;
  const dim = useDimensions().window;
  const onSearch = value => {
    meta.filter = value;
  };
  console.log(meta.position.ready);

  return (
    <>
      {meta.isShown && (
        <>
          <View
            onLayout={layout => {
              console.log("asd");
              meta.position.dH = layout.nativeEvent.layout.height;
              let y = meta.position.pH - meta.position.y;
              if (y > meta.position.dH) {
                meta.position.top = meta.position.y + 65;
                meta.position.bottom = null;
              } else {
                meta.position.top = null;
                meta.position.bottom = y;
              }
              meta.position.ready = true;
            }}
            style={{
              position: "absolute",
              bottom: meta.position.bottom,
              top: meta.position.top,
              left: 0,
              right: 0,
              minHeight: 150,
              maxHeight: 300,
              backgroundColor: "#fff",
              zIndex: 9,
              borderRadius: 4,
              display: "flex",
              alignItems: "stretch",
              justifyContent: "flex-start",
              padding: 10,
              borderWidth: 1,
              borderColor: theme.light,
              borderStyle: "solid",
              opacity: meta.position.ready ? 1 : 0
            }}
          >
            <Text
              style={{
                padding: 5,
                fontSize: 16,
                marginTop: 5,
                marginBottom: 5,
                color: theme.primary
              }}
            >
              {placeholder}
            </Text>
            {items.length > 5 && (
              <Input
                value={meta.filter}
                onChangeText={onSearch}
                placeholder="Search"
                style={{
                  backgroundColor: theme.light,
                  minHeight: 40,
                  maxHeight: 40,
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginTop: 0
                }}
              />
            )}
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
                keyExtractor={(item: any) => uuid(`select${item.value}`)}
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
                renderItem={({ item }) => {
                  const active = value === item.value;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item);
                        meta.isShown = false;
                        meta.value = item;
                        meta.position.ready = true;
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
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          </View>
          <TouchableWithoutFeedback onPress={() => (meta.isShown = false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1
              }}
            />
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
});
