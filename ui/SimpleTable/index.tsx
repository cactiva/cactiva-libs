import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useObservable, observer } from "mobx-react-lite";
import { toJS } from "mobx";

export default observer(({ data, style, cellStyle }: any) => {
    const meta = useObservable({
        headers: data.length > 0 ? Object.keys(data[0]) : []
    });

    useEffect(() => {
        meta.headers = data.length > 0 ? Object.keys(data[0]) : []
    }, [data, data.length])


    return <View style={{ flex: 1, flexDirection: "column", alignItems:"stretch", ...style }}>
       <View style={{ flexDirection: "row", minHeight: 20 }}>
            {meta.headers.map((h, key: number) => {
                return <View key={key} style={{ flex:1, ...cellStyle }}><Text style={{ flex: 1 }}>
                    {h}
                </Text></View>
            })}
        </View>
        <View style={{ flex: 1 }}>
            {data.map((row, rk) => {
                return <View key={rk} style={{ flexDirection: "row", minHeight: 20 }}>
                    {meta.headers.map((h, key: number) => {
                        return <View key={key} style={{  flex:1, ...cellStyle }}><Text style={{ flex: 1 }}>
                            {typeof row[h] == "object" ? JSON.stringify(row[h]) : row[h]}
                        </Text></View>
                    })}
                </View>
            })}
        </View>
    </View>;
})