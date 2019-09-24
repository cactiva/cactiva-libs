import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import { TextInput } from 'react-native';
import {
  Button,
  Select,
  SelectProps as BaseSelectProps
} from 'react-native-ui-kitten';

interface SelectProps extends BaseSelectProps {
  searchable?: boolean;
  onSerch?: (text) => void;
}

export default observer((props: SelectProps) => {
  const state = useObservable({
    ref: null,
    items: props.data,
    search: '',
    value: props.selectedOption as any
  });
  const onSearch = text => {
    state.search = text;
    props.onSerch && props.onSerch(text);
    let filter = props.data;
    if (!!text) {
      filter = props.data.filter(x => {
        return x.text.toLowerCase().includes(text.toLowerCase());
      });
      if (filter.length === 0) {
        filter.push({
          text: 'No item to display.',
          disabled: true
        });
      }
    }
    state.items = filter;
  };
  const onChange = value => {
    let selected = props.data.find(x => x.text === value.item.text);
    state.value = selected;
    state.ref.strategy.selectedOption = selected;
    props.onSelect(selected);
    state.ref.setVisibility();
  };

  if (props.searchable === undefined || !!props.searchable) {
    if (state.items.findIndex(x => x.text === 'search') < 0) {
      state.items = [
        {
          text: 'search',
          disabled: true
        },
        ...state.items
      ];
    }
  }

  return (
    <Select
      {...props}
      data={state.items}
      ref={ref => {
        !state.ref && (state.ref = ref);
      }}
      selectedOption={state.value}
      renderItem={item => {
        return (
          <>
            {item.item.text === 'search' ? (
              <TextInput
                autoFocus
                onChangeText={text => {
                  onSearch(text);
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
              <Button
                status={
                  state.value && item.item.text === state.value.text
                    ? 'primary'
                    : 'white'
                }
                style={{
                  borderRadius: 0,
                  justifyContent: 'flex-start'
                }}
                textStyle={{
                  color:
                    state.value && item.item.text === state.value.text
                      ? 'white'
                      : '#2a344f'
                }}
                onPress={() => {
                  onChange(item);
                }}
              >
                {item.item.text}
              </Button>
            )}
          </>
        );
      }}
    />
  );
});
