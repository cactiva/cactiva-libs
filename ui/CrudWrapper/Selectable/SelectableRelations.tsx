import { DefaultTheme } from "@src/libs/theme";
import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Modal } from '../..';
import Theme from '../../../../theme.json';
import SelectableRelationsTable from "./SelectableRelationsTable";
import useAsyncEffect from "use-async-effect";

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

export default observer((props: any) => {
    const { mode, relations, fk, label, field, auth, value, onSelect, onFocus, valuePath, labelPath } = props;
    const meta = useObservable({
        modal: false,
        list: [],
        preview: {
            list: [],
            isPreview: true
        },
        selectedAll: false
    });

    useAsyncEffect(() => {

    }, [
        value
    ]);

    return <>
        <TouchableOpacity onPress={() => {
            meta.modal = true;
        }} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
            {!value || (Array.isArray(value) && value.length === 0) ? <Text style={{ color: 'hsl(0,0%,50%)', fontSize: 13, fontFamily: _.get(Theme, 'fontFamily', undefined) }}>
                Select...
        </Text> : <SelectableRelationsTable
                    meta={meta.preview}
                    mode={mode}
                    auth={auth}
                    style={{ minHeight: meta.preview.list.length > 1 ? 110 : 75 }}
                    fk={fk}
                    relations={relations}
                    value={value} />
            }
            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" style={{ opacity: 0.5 }}><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
        </TouchableOpacity>

        <Modal
            animationType="none"
            transparent={true}
            visible={meta.modal}
            onRequestClose={() => {
                meta.modal = false;
            }}
        >
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => {
                    meta.modal = false;
                }}><View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,.2)"
                }} /></TouchableWithoutFeedback>

                {meta.modal &&
                    <View style={styles.modal}>
                        <View style={styles.modalTitle}>
                            <View style={styles.modalAction}>
                                <Text style={styles.modalTitleText}>{label}</Text>
                            </View>
                            {mode === 'filter' &&
                                <View style={styles.modalAction}>
                                    <TouchableOpacity onPress={() => {
                                        meta.modal = false;
                                        onSelect(value);
                                    }} style={[styles.buttonSmall, {
                                        backgroundColor: theme.light,
                                    }]}>
                                        <Text style={[styles.buttonText, { color: theme.dark }]}>
                                            Cancel
                                </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        meta.modal = false;
                                        onSelect(
                                            meta.list.filter((e) => {
                                                return !!e.__checked;
                                            }).map(e => {
                                                return e['id'];
                                            })
                                        )
                                    }} style={[styles.buttonSmall]}>
                                        <Text style={[styles.buttonText]}>
                                            Done
                                </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={styles.modalBody}>
                            <SelectableRelationsTable
                                meta={meta}
                                mode={mode}
                                auth={auth}
                                onSelect={onSelect}
                                fk={fk}
                                relations={relations}
                                value={value} />
                        </View>
                    </View>
                }
            </View>
        </Modal>
    </>;
});


const getTextColor = function (bgColor: string, lightColor: string, darkColor: string) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}
const textColor = getTextColor(Theme.colors.primary, '#fff', '#000');
const styles = StyleSheet.create({
    buttonText: {
        color: textColor,
        fontFamily: _.get(Theme, "fontFamily", undefined),
    },
    buttonSmall: {
        backgroundColor: Theme.colors.primary,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 5,
        borderRadius: 3,
    },
    modal: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: theme.light,
        flex: 1,
        flexDirection: 'column',
        width: '85%',
        alignSelf: 'center',
        margin: 50,
        borderRadius: 8
    },

    modalBody: {
        flex: 1
    },

    modalTitle: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalTitleText: {
        fontSize: 18,
        marginLeft: 3,
        color: theme.dark,
        fontFamily: _.get(Theme, "fontFamily", undefined),
    },
    modalAction: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})
