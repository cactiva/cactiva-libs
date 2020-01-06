import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import _ from 'lodash';
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { StyleSheet, Text as NativeText, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { isColumnForeign, reloadList } from ".";
import { Field, Modal } from "..";
import Form from "../Form";
import Icon from "../Icon";
import Spinner from "../Spinner";
import Table from "../Table";
import EmptyCell from "../Table/EmptyCell";
import TableHead from "../Table/TableHead";
import TableRow from "../Table/TableRow";
import Text from "../Text";
import View from "../View";
import BreadcrumbTrigger from "./BreadcrumbTrigger";
import SelectableForm from "./SelectableForm";

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

const ActionButton = ({ onPress, text, style }: any) => {
    return <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <NativeText style={styles.buttonText}>
            {text}
        </NativeText>
    </TouchableOpacity>;
}
export default observer(({
    idKey,
    breadcrumbs,
    breadForms,
    structure,
    fkeys,
    data,
    props,
    actions,
    mode,
    loading,
    style
}: any) => {
    const {
        list,
        filter,
        paging,
        form } = data;
    const meta = useObservable({
        filterModal: false
    });
    const actionsChildren = _.castArray(props.actions.children);
    const textStyle = _.get(props, 'title.props.style', {});
    return <View style={{ flexGrow: 1, ...style }}>
        <View style={styles.head}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {['create', 'edit'].indexOf(mode) >= 0 && !loading.list && <TouchableOpacity onPress={actions.cancel}>
                    <Icon
                        source={"Entypo"}
                        name={"chevron-thin-left"}
                        color={theme.primary}
                        size={20}
                        style={{
                            paddingHorizontal: 5,
                            marginTop: 2,
                            marginRight: 5
                        }}
                    ></Icon></TouchableOpacity>}

                <Text {...props.title} style={{ ...textStyle, fontSize: 16, fontWeight: 'bold' }}>
                    {loading.list && 'Loading '}
                    {_.startCase(mode)}
                    {' '}
                    {_.get(props, 'title.children', null)}
                    {' '}
                </Text>
                {loading.list && <Spinner style={{ marginRight: 5 }} />}
            </View>
            {loading.form ? <Spinner style={{ margin: 10 }} /> :
                <View {...props.actions} style={styles.actions} >
                    {mode === '' && paging.count > 0 && <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        borderRadius: 4,
                        backgroundColor: theme.light
                    }}>
                        {paging.total > 1 && <>
                            <Text style={{ color: theme.dark, marginHorizontal: 5, fontSize: 12 }}>
                                {paging.current} / {paging.total}
                            </Text>
                            <View style={styles.actionSeparator} />
                        </>
                        }

                        <Text style={{ color: theme.dark, marginHorizontal: 5, fontSize: 12 }}>
                            {paging.count} item{paging.count > 1 ? 's' : ''}
                        </Text>

                        {paging.total > 1 && <>
                            <View style={styles.actionSeparator} />
                            <TouchableOpacity onPress={actions.prevPage}>
                                <Icon
                                    source={"Feather"}
                                    name={"chevron-left"}
                                    color={paging.current - 1 > 0 ? theme.primary : theme.dark}
                                    size={18}
                                    style={{
                                        margin: 5
                                    }}
                                ></Icon>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={actions.nextPage}>
                                <Icon
                                    source={"Feather"}
                                    name={"chevron-right"}
                                    color={paging.current + 1 <= paging.total ? theme.primary : theme.dark}
                                    size={18}
                                    style={{
                                        margin: 5,
                                        marginRight: 0,
                                    }}
                                ></Icon>
                            </TouchableOpacity>
                        </>
                        }
                        <View style={styles.actionSeparator} />
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 5,
                        }} onPress={() => {
                            meta.filterModal = true;
                            filter.selected = null;
                        }}>
                            <Icon
                                source={"Ionicons"}
                                name={"ios-search"}
                                color={theme.dark}
                                size={18}
                                style={{
                                    margin: 5,
                                    marginRight: 0,
                                }}
                            ></Icon>
                            <Text style={{ color: theme.dark, marginHorizontal: 5, fontSize: 12 }}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                    }
                    {
                        actionsChildren.map((a, index) => {
                            const text = _.get(a, 'props.children.props.children');
                            const type = _.get(a, 'props.type');
                            if (mode === '') {
                                switch (type) {
                                    case "create":
                                        return <ActionButton key={index} onPress={actions.create} text={text} />
                                }
                            } else if (mode === 'create' || mode === 'edit') {
                                switch (type) {
                                    case "delete":
                                        if (mode === 'edit') {
                                            return <ActionButton key={index} onPress={() => {
                                                if (confirm('Are you sure ?')) {
                                                    actions.delete()
                                                }
                                            }} text={text} style={{ backgroundColor: theme.secondary }} />;
                                        }
                                        break;
                                    case "save":
                                        return <ActionButton key={index} onPress={actions.save} text={text} />;
                                    // case "cancel":
                                    //     return <ActionButton key={index} onPress={actions.cancel} text={text} />;
                                }

                                if (mode === 'edit' && type === 'edit') {
                                    return a;
                                }
                            }
                        })
                    }
                </View>
            }
        </View>

        <Modal
            animationType="fade"
            transparent={true}
            visible={meta.filterModal}
            onRequestClose={() => {
                meta.filterModal = false;
            }}
        >
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => {
                    meta.filterModal = false;
                }}><View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,.2)"
                }} /></TouchableWithoutFeedback>
                <View style={styles.modal}>
                    <View style={styles.modalTitle}>
                        <View style={styles.modalAction}>
                            <Text style={styles.modalTitleText}>Filter</Text>
                        </View>
                        <View style={styles.modalAction}>
                            <TouchableOpacity onPress={() => {
                                meta.filterModal = false;
                            }} style={[styles.buttonSmall, {
                                backgroundColor: theme.light,
                            }]}>
                                <Text style={[styles.buttonText, { color: theme.dark }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                meta.filterModal = false;
                                filter.form = {};
                                reloadList({
                                    structure,
                                    paging,
                                    idKey,
                                    data,
                                    loading,
                                    meta: {
                                        fkeys
                                    }
                                });
                            }} style={[styles.buttonSmall, {
                                backgroundColor: theme.secondary
                            }]}>
                                <Text style={[styles.buttonText]}>
                                    Reset
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                meta.filterModal = false;

                                reloadList({
                                    structure,
                                    paging,
                                    idKey,
                                    data,
                                    loading,
                                    meta: {
                                        fkeys
                                    }
                                });
                            }} style={[styles.buttonSmall]}>
                                <Text style={[styles.buttonText]}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.modalBody}>
                        <BaseForm
                            idKey={idKey}
                            breadcrumbs={breadcrumbs}
                            breadForms={breadForms}
                            structure={structure}
                            paging={paging}
                            fkeys={fkeys}
                            rawProps={props}
                            props={props.form(mode).props}
                            mode={'filter'}
                            form={form}
                            filter={filter}
                        /></View>
                </View>
            </View>
        </Modal>
        <View style={{ position: 'relative', flex: 1 }}>
            {mode === '' ? (loading.list && list.length === 0 ? null : (
                <Table
                    {...props.table.root}
                    style={{ flex: 1 }}
                    data={list}
                    onSort={(r, mode) => {
                        if (!isColumnForeign(r, fkeys)) {
                            if (mode) {
                                structure.orderBy = [{
                                    name: r,
                                    value: mode,
                                    valueType: 'StringValue'
                                }]
                            } else {
                                structure.orderBy = []
                            }
                            reloadList({
                                structure,
                                paging,
                                idKey,
                                data,
                                loading: loading,
                                meta: {
                                    fkeys
                                }
                            });
                            return true;
                        }
                        return false;
                    }}>
                    <TableHead {...props.table.head} />
                    <TableRow
                        {...props.table.row}
                        style={{ borderBottomWidth: 1, borderBottomColor: theme.light }}
                        onPress={props.table.row.onPress !== undefined ? props.table.row.onPress : (e) => {
                            actions.edit(e);
                        }} />
                </Table>)
            ) : <BaseForm
                    idKey={idKey}
                    breadcrumbs={breadcrumbs}
                    breadForms={breadForms}
                    structure={structure}
                    paging={paging}
                    fkeys={fkeys}
                    rawProps={props}
                    props={props.form(mode).props}
                    mode={mode}
                    form={form}
                    filter={filter}
                />}

        </View>
    </View>
})


const BaseForm = observer(({ idKey, breadcrumbs, breadForms, structure, paging, fkeys, props, rawProps, mode, form, filter }: any) => {
    let data = null;
    switch (mode) {
        case "filter":
            if (!filter.form) {
                filter.form = {}
            }
            data = filter.form;
            break;
        case "create":
        case "edit":
            data = form;
            break;
    }
    const breadForm = {};

    const processFields = (children) => {
        return _.castArray(children).map(e => {
            if (e && e.type === Field) {
                const fieldName = _.get(e, "props.path");
                if (filter.selected) {
                    return filter.selected === fieldName;
                }

                if (fieldName === idKey) {
                    return false;
                }
                else if (fkeys[fieldName] && fkeys[fieldName].table_schema) {
                    return {
                        ...e,
                        props: {
                            ...e.props,
                            label: e.props.label.indexOf('Id ') === 0 ? e.props.label.substr(3) : e.props.label,
                            children: <SelectableForm field={fieldName} fk={fkeys[fieldName]} />
                        }
                    };
                } else {
                    const fk = isColumnForeign(fieldName, fkeys);
                    if (fk) {
                        breadForm[fieldName] = {
                            el: e,
                            fk
                        };
                        return false;
                    }
                }
            } else {
                const echild = _.get(e, 'props.children')
                if (echild) {
                    return {
                        ...e,
                        props: {
                            ...e.props,
                            children: processFields(echild).filter(e => !!e)
                        }
                    }
                }
            }
            return e;
        }).filter(e => !!e)
    }
    const processedFields = processFields(props.children);
    const breadFormKeys = Object.keys(breadForm);
    const formEl = <Form {...props} data={data} style={{
        paddingLeft: 7,
        paddingRight: 0,
        height: '100%',
        paddingBottom: 500,
        flexGrow: 1
    }} children={processedFields} />;

    if (mode !== 'filter' && breadFormKeys.length > 0 && data && data[idKey]) {
        return <View style={{ flexGrow: 1, flexDirection: 'row', borderTopWidth: 3, borderTopColor: '#F1F1F1' }}>
            <View style={{ flexGrow: 1 }}>
                <View
                    type="ScrollView"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingVertical: 5,
                        paddingLeft: 10,
                        paddingRight: 15,
                    }}>{formEl}</View>
            </View>
            <View style={{ flexBasis: 230, borderLeftWidth: 1, borderLeftColor: '#ccc' }}>
                {breadFormKeys.map((key: string) => {
                    const e = breadForm[key].el;
                    const fk = breadForm[key].fk;
                    const label = e.props.label || e.props.path;
                    const list = _.castArray(data[e.props.path]).filter(e => !!e);
                    return <View key={key} style={{
                        backgroundColor: '#fff',
                        borderBottomColor: '#ccc',
                        padding: 5,
                        borderBottomWidth: 1,
                    }}><BreadcrumbTrigger
                        key={key}
                        breadcrumbs={breadcrumbs}
                        data={list}
                        itemPerPage={paging.itemPerPage}
                        tableName={fk.table_name}
                        title={label}
                        field={e.props.path}
                        where={
                            {
                                name: fk.foreign_column,
                                operator: '_eq',
                                value: data[idKey],
                                valueType: 'Int'
                            }}
                        rootStructure={{
                            ...structure,
                            __meta: {
                                forms: breadForms,
                                data,
                                title: _.get(rawProps, 'title.children'),
                                firstKey: _.get(rawProps, `table.head.children.0.props.path`),
                                firstTitle: _.get(rawProps, `table.head.children.0.props.title`),
                            }
                        }}
                        fkeys={fkeys}
                        style={{
                            paddingHorizontal: 5,
                            height: 35,
                            borderRadius: 4,
                            backgroundColor: '#f1f1f1',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 12 }}>{label}</Text>
                                {list.length === 0
                                    ? <EmptyCell />
                                    : <Text style={{ fontSize: 12 }}>{list.length} item{list.length > 1 ? 's' : ''}</Text>
                                }
                            </View>
                        </BreadcrumbTrigger></View>;
                })}
            </View>
        </View>
    }

    return <View
        type="ScrollView"
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingVertical: 5,
            paddingLeft: 10,
            paddingRight: 15, borderTopWidth: 3, borderTopColor: '#F1F1F1'
        }}>{formEl}</View>;

})

const getTextColor = function (bgColor: string, lightColor: string, darkColor: string) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}
const textColor = getTextColor(Theme.colors.primary, '#fff', '#000');
const styles = StyleSheet.create({
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    actions: {
        flexDirection: 'row'
    },
    button: {
        backgroundColor: Theme.colors.primary,
        padding: 10,
        marginLeft: 5,
        borderRadius: 5,
    },
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
    actionSeparator: {
        borderRightWidth: 1,
        borderColor: theme.dark,
        opacity: .2,
        margin: 5,
        marginVertical: 8,
        alignSelf: 'stretch'
    },

    modal: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: theme.light,
        flex: 1,
        flexDirection: 'column',
        width: 700,
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
