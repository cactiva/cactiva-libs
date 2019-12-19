import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import Table from '../Table';
import TableRow from '../Table/TableRow';
import TableHead from '../Table/TableHead';
import Modal from '../Modal';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { DefaultTheme } from '@src/libs/theme';
import Theme from "@src/theme.json";
import Form from '../Form';
import Icon from '../Icon';
export default observer(({ idKey = "id", data, children, structure }: any) => {
    const table = generateTable(children, idKey, data);
    const formRaw = generateForm(children, idKey, data);
    const meta = useObservable({
        currentIndex: -1,
        currentRow: null,
        modalOpened: false
    });
    const FormEl = formRaw('edit', meta.currentRow)
    return <>
        <Table {...table.props} data={data.list}>
            <TableHead {...table.headProps} />
            <TableRow {...table.rowProps} onPress={(e, idx) => {
                meta.currentRow = e;
                meta.currentIndex = idx;
                meta.modalOpened = true;
            }} />
        </Table>
        {meta.modalOpened && <Modal>
            <View style={styles.modal}>
                <View style={styles.modalTitle}>
                    <View style={styles.modalAction}>
                        <TouchableOpacity onPress={() => {
                            meta.modalOpened = false;
                        }}>
                            <Icon
                                source={"AntDesign"}
                                name={"arrowleft"}
                                color={theme.primary}
                                size={18}
                            />
                        </TouchableOpacity>
                        <Text style={styles.modalTitleText}>Edit</Text>
                    </View>
                    <View style={styles.modalAction}>
                        <ActionButton onPress={() => {
                            data[meta.currentIndex] = meta.currentRow;
                            meta.modalOpened = false;
                        }} text="OK" />
                    </View>
                </View>
                <Form {...FormEl.props} style={{ flex: 1 }} />
            </View>

        </Modal>}
    </>;
});

const generateForm = (children, idKey, row) => {
    let form = _.find(children, (e => typeof e === 'function'));
    return form;
}

const generateTable = (children, idKey, list) => {
    let rawTable = _.find(children, (e => e.type === Table))

    const table = {
        props: { ...rawTable.props, },
        headProps: null,
        rowProps: null,
        data: list.list
    }

    const castedIdKey = _.startCase(idKey);
    _.castArray(rawTable.props.children).map(c => {
        if (c.type === TableRow) {
            table.rowProps = {
                ...c.props, children: _.castArray(c.props.children)
                    .filter(r => {
                        return r.props.path !== idKey;
                    })
                    .map(r => {
                        return r;
                    })
            };
        } else if (c.type === TableHead) {
            table.headProps = {
                ...c.props, children: _.castArray(c.props.children).filter(r => {
                    return r.props.title !== castedIdKey;
                })
            };
        }
    })

    return table;
}

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

const ActionButton = ({ onPress, text }: any) => {
    return <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>
            {text}
        </Text>
    </TouchableOpacity>;
}
const getTextColor = function (bgColor: string, lightColor: string, darkColor: string) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}
const textColor = getTextColor(Theme.colors.primary, '#fff', '#000');

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    },
    modalTitle: {
        marginHorizontal: -10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: -8,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: theme.light,
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
    button: {
        backgroundColor: Theme.colors.primary,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 5,
        borderRadius: 3,
    },
    buttonText: {
        color: textColor,
        fontFamily: _.get(Theme, "fontFamily", undefined),
    },
    modal: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: theme.light,
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        width: 700,
        alignSelf: 'center',
        margin: 50,
        borderRadius: 8
    }
})