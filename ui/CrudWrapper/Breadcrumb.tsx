import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "../Icon";
import Text from "../Text";
import { reloadList } from ".";

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};
export default ({ breadcrumbs, itemPerPage }: any) => {
    const lastIdx = breadcrumbs.path.length - 1;
    return <View style={{
        flexDirection: 'row',
        borderBottomColor: '#ececeb',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#FAFAFA',
        backgroundColor: '#fff',
        paddingLeft: 10,
    }}>
        {breadcrumbs.path.map((b, idx) => {
            return <View key={idx} style={{
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    style={{
                        maxWidth: 300,
                        overflow: 'hidden',
                    }}
                    onPress={() => {
                        if (idx === 0) {
                            breadcrumbs.path = [];
                        } else if (idx === 1) {
                            breadcrumbs.path = breadcrumbs.path.slice(0, idx + 1);
                        } else if (idx !== lastIdx) {
                            breadcrumbs.path = breadcrumbs.path.slice(0, idx + 1);
                            const bread = breadcrumbs.path[breadcrumbs.path.length - 1];
                            reloadList({
                                structure: bread.structure,
                                paging: bread.data.paging,
                                idKey: bread.idKey,
                                data: bread.data,
                                loading: bread.loading,
                                meta: bread
                            });
                        }
                    }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: idx !== lastIdx ? "#999" : theme.primary }}>
                        {b.title}
                    </Text>
                </TouchableOpacity>
                {idx !== lastIdx && <Icon source="Feather" name="chevron-right" size={20} color="#ccc" />}
            </View>
        })}
    </View>
}