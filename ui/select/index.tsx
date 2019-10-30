import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useDimensions } from "react-native-hooks";
import { DefaultTheme, ThemeProps } from "../../theme";
import { fuzzyMatch, uuid } from "../../utils";
import Icon from "../icon";
import Input, { InputProps } from "../input";

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
    filter: ""
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
        onPress={() => (meta.isShown = true)}
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
      <ModalItems meta={meta} {...props} />
    </>
  );
});

const ModalItems = observer((props: any) => {
  const { meta, placeholder, items, value, onSelect } = props;
  const theme = DefaultTheme;
  const dim = useDimensions().window;
  return (
    <Modal animationType="slide" transparent={true} visible={meta.isShown}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: 150,
          maxHeight: 400,
          backgroundColor: "#fff",
          zIndex: 9,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "flex-start",
          padding: 10
        }}
      >
        <RenderItem {...props} meta={meta} theme={theme} />
      </View>
      <TouchableWithoutFeedback onPress={() => (meta.isShown = false)}>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,.3)",
            zIndex: 1,
            height: dim.height
          }}
        />
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const RenderItem = observer((props: any) => {
  const { meta, placeholder, items, value, onSelect, theme } = props;

  const onSearch = value => {
    meta.filter = value;
  };
  return (
    <>
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
          keyExtractor={(item: any) => `select-${item.value}`}
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
    </>
  );
});
