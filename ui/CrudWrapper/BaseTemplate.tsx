import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import _ from 'lodash';
import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, Text as NativeText, TouchableOpacity } from "react-native";
import { isColumnForeign } from ".";
import { Field } from "..";
import Form from "../Form";
import Icon from "../Icon";
import Spinner from "../Spinner";
import Table from "../Table";
import TableHead from "../Table/TableHead";
import TableRow from "../Table/TableRow";
import Text from "../Text";
import View from "../View";
import BreadcrumbTrigger from "./BreadcrumbTrigger";
import EmptyCell from "../Table/EmptyCell";
import { toJS } from "mobx";

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
export default observer(({ idKey, breadcrumbs, breadForms, structure, fkeys, list, filter, paging, form, props, actions, mode, loading, style, subCrudQueries }: any) => {
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

                {loading.list && <Spinner style={{ marginRight: 5 }} />}
                <Text {...props.title} style={{ ...textStyle, fontSize: 16, fontWeight: 'bold' }}>
                    {loading.list && 'Loading '}
                    {_.startCase(mode)}
                    {' '}
                    {_.get(props, 'title.children', null)}
                    {' '}
                </Text>
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
        <View style={{ position: 'relative', flex: 1 }}>
            {mode === '' ? (loading.list && list.length === 0 ? null : <Table
                {...props.table.root}
                style={{ flex: 1 }}
                data={list}>
                <TableHead {...props.table.head} />
                <TableRow
                    {...props.table.row}
                    style={{ borderBottomWidth: 1, borderBottomColor: theme.light }}
                    onPress={props.table.row.onPress !== undefined ? props.table.row.onPress : (e) => {
                        actions.edit(e);
                    }} />
            </Table>) : <BaseForm
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
                    subCrudQueries={subCrudQueries}
                />}

        </View>
    </View>
})

const BaseForm = observer(({ idKey, breadcrumbs, breadForms, structure, paging, fkeys, props, rawProps, mode, form, filter, subCrudQueries }: any) => {
    let data = null;
    switch (mode) {
        case "filter": data = filter; break;
        case "create":
        case "edit":
            data = form;
            break;
    }
    const breadForm = {};

    const filterFields = (children) => {
        return _.castArray(children).map(e => {
            if (e.type === Field) {
                const fieldName = _.get(e, "props.path");
                const fk = isColumnForeign(fieldName, fkeys);
                if (fk) {
                    breadForm[fieldName] = {
                        el: e,
                        fk
                    };
                    return false;
                }
                if (fieldName === idKey) return false;
            } else {
                const echild = _.get(e, 'props.children')
                if (echild) {
                    return {
                        ...e,
                        props: {
                            ...e.props,
                            children: filterFields(echild).filter(e => !!e)
                        }
                    }
                }
            }
            return e;
        }).filter(e => !!e)
    }
    const filteredFields = filterFields(props.children);
    const breadFormKeys = Object.keys(breadForm);
    const formEl = <Form {...props} data={data} style={{
        paddingLeft: 7,
        paddingRight: 0,
        flex: 1
    }} children={filteredFields} onFieldFunction={(fc, list, setValue, path) => {
        return fc({ list: list, queries: subCrudQueries, setValue, path });
    }} />;

    if (breadFormKeys.length > 0) {
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
                    const list = _.castArray(data[e.props.path]);
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
    actionSeparator: {
        borderRightWidth: 1,
        borderColor: theme.dark,
        opacity: .2,
        margin: 5,
        marginVertical: 8,
        alignSelf: 'stretch'
    }
})
