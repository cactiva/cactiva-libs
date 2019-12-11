import React from 'react';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

interface IColumnProps {
    title?: string
    width?: number
    path?: string
}
export default observer((props: IColumnProps) => {
    return <View>
        news
    </View>;
})