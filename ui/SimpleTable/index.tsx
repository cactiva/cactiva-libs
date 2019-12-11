import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { toJS } from "mobx";

interface IColumn {
    title: string
    path: string
}

interface IMeta {
    headers: IColumn[]
}

export default observer(({ data, columnMode, style, cellStyle, children }: any) => {
    const generateColumns = () => {
        return Object.keys(data[0]).map((e) => ({
            title: e,
            path: e
        }));
    }
    const meta: IMeta = useObservable({
        headers: [] as IColumn[]
    });
    const length = data && data.length;

    useEffect(() => {
        if (!columnMode || columnMode === 'auto') {
            meta.headers = ((length > 0 ? generateColumns() : []) as unknown) as IColumn[]
        } else {
            if (Array.isArray(children)) {
                meta.headers = (children || []).map((c: { props: IColumn }) => {
                    return c.props;
                })
            }
        }
        console.log(toJS(meta.headers))
    }, [data, length])


    return <View style={{ flex: 1, flexDirection: "column", alignItems: "stretch", ...style }}>
        <View style={{ flexDirection: "row", minHeight: 20 }}>
            {meta.headers.map((h: IColumn, key: number) => {
                return <View key={key} style={{ flex: 1, ...cellStyle }}><Text style={{ flex: 1 }}>
                    {h.title}
                </Text></View>
            })}
        </View>
        <View style={{ flex: 1 }}>
            {length > 0 && data.map((row, rk) => {
                return <View key={rk} style={{ flexDirection: "row", minHeight: 20 }}>
                    {meta.headers.map((h: IColumn, key: number) => {
                        return <View key={key} style={{ flex: 1, ...cellStyle }}><Text style={{ flex: 1 }}>
                            {typeof row[h.path] == "object" ? JSON.stringify(row[h.path]) : row[h.path]}
                        </Text></View>
                    })}
                </View>
            })}
        </View>
    </View>;
})