import React from 'react';
import { Select, SelectProps as BaseSelectProps } from 'react-native-ui-kitten';
import { View } from 'react-native';
import { default as Input } from '../input';
import { observer, useObservable } from 'mobx-react-lite';

interface SelectProps extends BaseSelectProps {
  onChange?: (value) => void;
  onSerch?: (text) => void;
}

export default observer((props: SelectProps) => {
  const state = useObservable({
    active: true
  });
  return (
    <View>
      {state.active && <Input autoFocus />}
      <Select
        {...props}
        onPress={() => {
          state.active = !state.active;
        }}
      />
    </View>
  );
});
