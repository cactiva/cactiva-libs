import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import { observer, useObservable } from "mobx-react-lite";
import React from 'react';
import { TouchableOpacity } from 'react-native';
import TableColumn from "../Table/TableColumn";
import Text from '../Text';
import _ from "lodash";
import { reloadList, isColumnForeign, declareActions } from ".";
import { Spinner, Button, Form, Field, Input } from "..";
import { observable } from "mobx";
import EmptyCell from "../Table/EmptyCell";

const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

const idKey = 'id';
const BreadcrumbTrigger = observer(({ style, title, children, field, itemPerPage, data, rootStructure, breadcrumbs, where, tableName }: any) => {
    const meta = useObservable({ loading: false });
    return <TouchableOpacity
        style={style ? style : {
            flex: 1,
            borderRadius: 4,
            padding: 3,
            paddingVertical: 5,
            marginRight: 5,
            marginVertical: -5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.light
        }}
        onPress={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            meta.loading = true;
            const cstruct = _.cloneDeep(rootStructure.fields.filter(e => { return e.name === field })[0]);
            let hasId = false;
            cstruct.fields.forEach(e => {
                if (e.name === idKey) { hasId = true }
            })
            cstruct.name = tableName;
            if (!hasId) {
                cstruct.fields.push({ name: idKey });
            }
            if (where)
                cstruct.where.push(where);

            const bread = observable({
                field,
                title,
                mode: '',
                loading: {
                    list: false,
                    form: false
                },
                idKey: idKey,
                fkeys: null,
                data: {
                    paging: {
                        total: 1,
                        current: 1,
                        itemPerPage,
                        count: 0
                    },
                    form: {},
                    list: [],
                    auth: data.auth
                },
                props: null as any,
                actions: null as any,
                structure: cstruct,
            });

            await reloadList({
                structure: bread.structure,
                paging: bread.data.paging,
                idKey: bread.idKey,
                itemPerPage,
                data: bread.data,
                loading: bread.loading,
                meta: bread
            });

            bread.actions = declareActions({
                auth: data.auth,
                onChange: false,
                structure: bread.structure,
                paging: bread.data.paging,
                idKey: bread.idKey,
                itemPerPage,
                data: bread.data,
                breadcrumbs,
                meta: bread,
                baseForm: {
                    [where.name]: where.value
                }
            })

            bread.props = {
                table: {
                    root: {
                        columnMode: "manual",
                        onSort: () => { },
                    },
                    row: {
                        children: cstruct.fields.filter(r => (r.name !== idKey)).map((r, rk) => {
                            const fk = isColumnForeign(r.name, bread.fkeys)
                            if (fk) {
                                return <TableColumn path={r.name}>
                                    {
                                        (c, params) => {
                                            const firstKey = _.get(bread.props, `table.head.children.0.props.path`);
                                            const firstCell = (params.item[firstKey] || '').toString().trim();
                                            const rootTitle = _.get(bread.props, 'title.children', '');
                                            return <BreadcrumbTrigger
                                                breadcrumbs={breadcrumbs}
                                                data={c}
                                                itemPerPage={itemPerPage}
                                                tableName={fk.table_name}
                                                title={_.get(bread.props, `table.head.children.${rk}.props.title`, r.name)}
                                                field={r.name}
                                                where={
                                                    {
                                                        name: fk.foreign_column,
                                                        operator: '_eq',
                                                        value: params.item[idKey],
                                                        valueType: 'Int'
                                                    }}
                                                rootStructure={{
                                                    ...rootStructure,
                                                    ...bread.structure,
                                                }}
                                                fkeys={bread.fkeys} />;
                                        }
                                    }
                                </TableColumn>;
                            }
                            return <TableColumn path={r.name} />
                        })
                    },
                    head: {
                        children: cstruct.fields.filter(r => (r.name !== idKey)).map((r, rk) => {
                            return <TableColumn key={rk} path={r.name} title={_.startCase(r.name)} />
                        })
                    }
                },
                form: rootStructure.__meta.forms[field] || ((mode: any) => {
                    return <Form>
                        {cstruct.fields.filter(r => (r.name !== idKey)).map((r, rk) => {
                            return <Field key={rk} label={_.startCase(r.name)} path={r.name}>
                                <Input type={"text"}></Input>
                            </Field>
                        })}
                    </Form>;
                }),
                title: {
                    children: title
                },
                actions: {
                    style: {
                        flexDirection: 'row'
                    },
                    children: [
                        <Button type={"create"}>
                            <Text>Create</Text>
                        </Button>,
                        <Button type={"delete"}>
                            <Text>Delete</Text>
                        </Button>,
                        <Button type={"save"}>
                            <Text>Save</Text>
                        </Button>,
                        <Button type={"cancel"}>
                            <Text>Cancel</Text>
                        </Button>]
                }
            };
            if (breadcrumbs.path.length <= 1) {
                const bcumbs = [];
                const rmeta = rootStructure.__meta;
                const firstKey = rmeta.firstKey;
                const firstCell = (rmeta.data[firstKey] || '').toString().trim();
                const rootTitle = rmeta.title;
                bcumbs.push({
                    title: `${rootTitle}`,
                    mode: '',
                })
                bcumbs.push({
                    title: `${firstKey}: ${firstCell}`,
                    data
                })
                bcumbs.push(bread);
                breadcrumbs.path = bcumbs;
            } else {
                breadcrumbs.path.push(bread);
            }
            meta.loading = false;
        }}>

        {meta.loading
            ? <Spinner />
            : children ? children : <Text style={{ color: '#000', fontSize: 12, }}>
                {Array.isArray(data)
                    ? data.length > 0 ? `${data.length} item${data.length > 1 ? 's' : ''}` : <EmptyCell />
                    : <EmptyCell />}
            </Text>}
    </TouchableOpacity>
})

export default BreadcrumbTrigger;