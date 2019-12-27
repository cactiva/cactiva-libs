import React from "react";
import { View } from "react-native";
import Text from "../Text";

export default ({ breadcrumbs, itemPerPage }: any) => {
    return <View style={{ flexDirection: 'row', padding: 5, maxWidth: 200 }}>
        {breadcrumbs.path.map((b, idx) => {
            return <Text key={idx}>{b.title}</Text>
        })}
    </View>
}