import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Text from '../Text';
import { observer } from "mobx-react-lite";

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

export default observer(({ data, structure, fkeys }: any) => {
    return <TouchableOpacity
        style={{
            flex: 1,
            borderRadius: 4,
            padding: 3,
            paddingVertical: 8,
            marginRight: 5,
            marginVertical: -8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.light
        }}
        onPress={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}><Text style={{ color: '#000', fontSize: 12, }}>
            {Array.isArray(data)
                ? data.length > 0 ? `${data.length} item${data.length > 1 ? 's' : ''}` : '- Empty -'
                : '- Empty -'}
        </Text></TouchableOpacity>
})