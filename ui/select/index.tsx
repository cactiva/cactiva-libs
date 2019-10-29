import { UIThemeProps } from "../../themes";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { Select, SelectProps as BaseSelectProps } from "react-native-ui-kitten";
import { SelectOptionType } from "react-native-ui-kitten/ui/select/selectOption.component";

interface DataProps extends SelectOptionType {
  value: any;
}

export interface SelectProps extends BaseSelectProps {
  searchable?: boolean;
  onSerch?: (text) => void;
  theme?: UIThemeProps;
  data: DataProps[];
  meta?: any;
}

export default observer((props: SelectProps) => {
  const { data, selectedOption, onSerch, onSelect, searchable } = props;
  const state = useObservable({
    ref: null,
    items: data,
    search: "",
    value: selectedOption as any
  });
  const onSearchInput = text => {
    state.search = text;
    onSerch && onSerch(text);
    let filter = data;
    if (!!text) {
      filter = data.filter(x => {
        return x.text.toLowerCase().includes(text.toLowerCase());
      });
      if (filter.length === 0) {
        filter.push({
          text: "No item to display.",
          value: "",
          disabled: true
        });
      }
    }
    state.items = filter;
  };
  const onChange = value => {
    let selected = data.find(x => x.text === value.item.text);
    state.value = selected;
    state.ref.strategy.selectedOption = selected;
    onSelect(selected);
    state.ref.setVisibility();
  };

  if (searchable === undefined || !!searchable) {
    if (state.items.findIndex(x => x.text === "search") < 0) {
      state.items = [
        {
          text: "search",
          value: "",
          disabled: true
        },
        ...state.items
      ];
    }
  }
  return (
    <Select
      data={state.items}
      ref={ref => {
        !state.ref && (state.ref = ref);
      }}
      selectedOption={state.value}
      style={{
        flex: 1,
        padding: 0
      }}
      labelStyle={{
        margin: 0,
        padding: 0
      }}
      themedStyle={{
        padding: 0
      }}
      controlStyle={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        margin: -4,
        minHeight: 25
      }}
      textStyle={{
        marginLeft: 0,
        color: !state.value ? "#757575" : "#3a3a3a",
        fontWeight: "400"
      }}
      activeOpacity={1}
      {...props}
      renderItem={item => {
        return (
          <>
            {item.item.text === "search" ? (
              <TextInput
                autoFocus
                onChangeText={text => {
                  onSearchInput(text);
                }}
                style={{
                  minHeight: 38,
                  padding: 5
                }}
                value={state.search}
              />
            ) : !!props.renderItem ? (
              props.renderItem
            ) : (
              <TouchableOpacity
                onPress={() => {
                  onChange(item);
                }}
                style={{
                  padding: 5,
                  paddingTop: 12,
                  paddingBottom: 12,
                  // borderBottomWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#ebebeb"
                }}
              >
                <Text>{item.item.text}</Text>
              </TouchableOpacity>
            )}
          </>
        );
      }}
    />
  );
});

const Styles = {
  root: {}
};
