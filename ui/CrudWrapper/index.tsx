import api from '@src/libs/utils/api';
import { generateDeleteString } from '@src/libs/utils/genDeleteString';
import { generateInsertString } from '@src/libs/utils/genInsertString';
import { generateQueryString } from '@src/libs/utils/genQueryString';
import { generateUpdateString } from '@src/libs/utils/genUpdateString';
import { queryAll } from '@src/libs/utils/gql';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import { View as ViewNative } from 'react-native';
import useAsyncEffect from "use-async-effect";
import { Spinner } from '..';
import Table from '../Table';
import TableHead from '../Table/TableHead';
import TableRow from '../Table/TableRow';
import Text from '../Text';
import View from '../View';
import BaseTemplate from './BaseTemplate';
import Breadcrumb from './Breadcrumb';
import BreadcrumbTrigger from './BreadcrumbTrigger';


export default observer(({ data, children, template, idKey = "id", itemPerPage = 25, style, onChange }: any) => {
    const structure = _.get(data, 'structure', null);

    if (structure) {
        let hasId = false;
        structure.fields.forEach(e => {
            if (e.name === idKey) {
                hasId = true;
            }
        })
        if (!hasId) {
            structure.fields.push({ name: idKey });
        }
    }

    const paging = _.get(data, 'paging', {
        total: 1,
        current: 1,
        itemPerPage,
        count: 0
    });
    const auth = _.get(data, 'auth');
    const Template = template ? template : BaseTemplate;
    const props = {
        table: {
            root: null,
            row: null,
            head: null
        },
        form: null,
        title: null,
        actions: null
    };
    const breadForms = {};
    const meta = useObservable({
        mode: '',
        form: {},
        loading: {
            list: false,
            form: false
        },
        breadcrumbs: {
            path: [],
            structure: {},
        },
        fkeys: null as any,
        subCrudQueries: {}
    });


    const castedIdKey = _.startCase(idKey);

    children.map((e) => {
        if (e.type === Table) {
            props.table.root = {
                ...e.props,
                onSort: (r, mode) => {
                    if (!isColumnForeign(r, meta.fkeys)) {
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
                            itemPerPage,
                            data,
                            loading: meta.loading,
                            meta
                        });
                        return true;
                    }
                    return false;
                }
            };
            if (structure && structure.orderBy.length > 0) {
                props.table.root.config = {
                    sortMode: _.get(structure, 'orderBy.0.value'),
                    sortField: _.get(structure, 'orderBy.0.name'),
                }
            }

            _.castArray(e.props.children).map(c => {
                if (c.type === TableRow) {
                    props.table.row = {
                        ...c.props, children: _.castArray(c.props.children)
                            .filter(r => {
                                return r.props.path !== idKey;
                            })
                            .map((r, rk) => {
                                let fk = null;
                                if (r.props && !r.props.children && r.props.path[r.props.path.length - 1] === 's') {
                                    fk = isColumnForeign(r.props.path, meta.fkeys);
                                }
                                if (fk) {
                                    return {
                                        ...r, props: {
                                            ...r.props,
                                            children: (c, params) => {
                                                return <BreadcrumbTrigger
                                                    breadcrumbs={meta.breadcrumbs}
                                                    data={c}
                                                    itemPerPage={itemPerPage}
                                                    tableName={fk.table_name}
                                                    title={_.get(props, `table.head.children.${rk}.props.title`, r.props.path)}
                                                    field={r.props.path}
                                                    where={
                                                        {
                                                            name: fk.foreign_column,
                                                            operator: '_eq',
                                                            value: params.item[idKey],
                                                            valueType: 'Int'
                                                        }}
                                                    rootStructure={{
                                                        ...structure,
                                                        __meta: {
                                                            forms: breadForms,
                                                            title: _.get(props, 'title.children', ''),
                                                            data: params.item,
                                                            firstTitle: _.get(props, `table.head.children.0.props.title`),
                                                            firstKey: _.get(props, `table.head.children.0.props.path`)
                                                        }
                                                    }}
                                                    fkeys={meta.fkeys} />;
                                            }
                                        }
                                    };
                                } else {

                                    return r;
                                }
                            })
                    };
                } else if (c.type === TableHead) {
                    props.table.head = {
                        ...c.props, children: _.castArray(c.props.children).filter(r => {
                            return r.props.title !== castedIdKey;
                        })
                    };
                }
            })
        } else if (e.type === Text) {
            props.title = { ...e.props };
        } else if (e.type === View || e.type === ViewNative) {
            if (!e.props.type) {
                props.actions = { ...e.props };
            } else {
                breadForms[e.props.type] = e.props.children;
            }
        } else {
            props.form = e;
        }
    })

    useAsyncEffect(async () => {
        if (meta.breadcrumbs.path.length <= 1) {
            meta.mode = '';
            await reloadList({
                structure,
                paging,
                idKey,
                itemPerPage,
                data,
                loading: meta.loading,
                meta
            });
        } else if (meta.breadcrumbs.path.length === 2) {
            const bread = meta.breadcrumbs.path[meta.breadcrumbs.path.length - 1];
            if (bread) {
                meta.mode = 'edit';
                data.form = bread.rootStructure.__meta.data;
            } else {
                console.log(toJS(meta.breadcrumbs));
            }
        }
    }, [structure, meta.breadcrumbs.path]);

    if (!meta.fkeys) return <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 250, minWidth: 50 }}>
        <Spinner />
    </View>;

    if (meta.breadcrumbs.path.length > 2) {
        const bread = meta.breadcrumbs.path[meta.breadcrumbs.path.length - 1];
        return <View style={{ flexGrow: 1 }}>
            <Breadcrumb breadcrumbs={meta.breadcrumbs} itemPerPage={itemPerPage} />
            <Template
                fkeys={bread.fkeys}
                structure={bread.structure}
                breadcrumbs={meta.breadcrumbs}
                breadForms={breadForms}
                auth={structure.auth}
                list={bread.data.list}
                form={bread.data.form}
                props={toJS(bread.props)}
                paging={bread.data.paging}
                loading={bread.loading}
                idKey={idKey}
                mode={bread.mode}
                actions={bread.actions}
            />
        </View>;
    } else if (meta.breadcrumbs.path.length === 2) {
        return <View style={{ flexGrow: 1 }}>
            <Breadcrumb breadcrumbs={meta.breadcrumbs} itemPerPage={itemPerPage} />
            <Template {...data}
                fkeys={meta.fkeys}
                structure={structure}
                breadcrumbs={meta.breadcrumbs}
                breadForms={breadForms}
                paging={paging}
                style={style}
                props={props}
                idKey={idKey}
                mode={meta.mode}
                loading={meta.loading}
                subCrudQueries={meta.subCrudQueries}
                actions={declareActions({
                    data, meta, paging, structure, idKey, itemPerPage, auth, onChange, breadcrumbs: meta.breadcrumbs
                })} />
        </View>;
    }

    return <Template {...data}
        fkeys={meta.fkeys}
        structure={structure}
        breadcrumbs={meta.breadcrumbs}
        breadForms={breadForms}
        paging={paging}
        style={style}
        props={props}
        idKey={idKey}
        mode={meta.mode}
        loading={meta.loading}
        subCrudQueries={meta.subCrudQueries}
        actions={declareActions({
            data, meta, paging, structure, idKey, itemPerPage, auth, onChange, breadcrumbs: meta.breadcrumbs
        })} />;
});

const executeSubCrudActions = async (meta: any, id: any) => {
    await Promise.all(_.values(meta.subCrudQueries).map(async m => {
        const insert = _.values(m.insert).map(s => {
            const q = generateInsertString(s.structure.table, {
                ...s.data,
                [s.foreignKey]: id
            })
            return queryAll(q.query, { variables: q.variables, auth: s.structure.auth });
        });
        const update = _.values(m.update).map(s => {
            const q = generateUpdateString(s.structure.table, s.foreignKey ? {
                ...s.data,
                [s.foreignKey]: id
            } : s.data, {
                where: [{
                    name: s.idKey,
                    operator: '_eq',
                    value: s.data[s.idKey],
                    valueType: 'IntVal'
                }]
            })
            return queryAll(q.query, { variables: q.variables, auth: s.structure.auth });
        });
        const del = _.values(m.delete).map(s => {
            const q = generateDeleteString(s.structure.table, {
                where: [{
                    name: s.idKey,
                    operator: '_eq',
                    value: s.data[s.idKey],
                    valueType: 'IntVal'
                }]
            })
            return queryAll(q.query, { auth: s.structure.auth });
        });
        return Promise.all([...insert, ...update, ...del]);
    }));

    meta.subCrudQueries = {};
}

export const isColumnForeign = (col: string, fkeys) => {
    const fcol = fkeys ? Object.keys(fkeys) : [];
    const res = fcol.filter(f => {
        if (col.replace(f, '').length <= 2) {
            return true;
        }
        return false;
    })

    if (res.length > 0) {
        const fcol = Object.keys(fkeys[res[0]]);
        if (fcol.length > 0) {
            const fk = fkeys[res[0]][fcol[0]];
            if (typeof fk === 'object') {
                return { ...fk, foreign_column: fcol[0] };
            }
        }
    }
    return false;
}

export const reloadList = async (params: { structure, loading, paging, idKey, itemPerPage, data, meta }) => {
    let { structure, loading, paging, idKey, itemPerPage, data, meta } = params;
    if (structure) {
        loading.list = true;
        const currentPage = _.get(paging, 'current', 1)
        const orderBy = structure.orderBy.length > 0 ? structure.orderBy : [{
            name: idKey,
            value: 'desc',
            valueType: 'StringValue'
        }];
        const query = generateQueryString({
            ...structure, orderBy, options: {
                ...structure.options,
                limit: itemPerPage,
                offset: (currentPage - 1) * itemPerPage
            }
        });
        const res = await queryAll(query, { auth: data.auth });

        _.map(res, (e) => {
            if (e.aggregate) {
                const count = e.aggregate.count
                data.paging.count = count;
                if (!data.paging.current)
                    data.paging.current = 1;
                data.paging.total = Math.ceil(count / itemPerPage);
            } else {
                data.list = e || [];
            }
        });
        loading.list = false;

        if (meta.fkeys === null) {
            const res = await api({ url: `/api/db/structure?table=${structure.name}` }) as any[];
            if (res) {
                const tempfkeys = {};
                res.forEach(e => {
                    if (e.table_name === structure.name) {
                        tempfkeys[e.column_name] = e;
                    } else {
                        if (!tempfkeys[e.table_name]) {
                            tempfkeys[e.table_name] = {};
                        }
                        tempfkeys[e.table_name][e.column_name] = e;
                    }
                })
                meta.fkeys = tempfkeys;
            }
        }
    }
};

const modifyBread = (breadcrumbs: any, callback: any) => {
    if (breadcrumbs.path.length > 0) {
        const bread = breadcrumbs.path[breadcrumbs.path.length - 1];
        if (!bread.originalTitle) {
            bread.originalTitle = bread.title;
        }
        callback(bread);
    }
}

export const declareActions = (props: { data, breadcrumbs, meta, paging, structure, idKey, itemPerPage, auth, onChange, baseForm?: any }) => {
    const { data, breadcrumbs, meta, paging, structure, idKey, itemPerPage, auth, onChange, baseForm } = props;
    return {
        edit: (input) => {
            meta.mode = 'edit';
            data.form = input;

            modifyBread(breadcrumbs, (bread) => {
                bread.title = `${bread.originalTitle} (Edit)`;
            })

            if (baseForm) {
                for (let i in baseForm) {
                    data.form[i] = baseForm[i];
                }
            }
        },
        create: () => {
            meta.mode = 'create';
            data.form = {};
            modifyBread(breadcrumbs, (bread) => {
                bread.title = `${bread.originalTitle} (Create)`;
            })
            if (baseForm) {
                for (let i in baseForm) {
                    data.form[i] = baseForm[i];
                }
            }
        },
        prevPage: () => {
            if (paging.current - 1 > 0) {
                paging.current--;
                reloadList({
                    structure,
                    paging,
                    idKey,
                    itemPerPage,
                    data,
                    loading: meta.loading,
                    meta
                });
            }
        },
        nextPage: () => {
            if (paging.current + 1 <= paging.total) {
                paging.current++;
                reloadList({
                    structure,
                    paging,
                    idKey,
                    itemPerPage,
                    data,
                    loading: meta.loading,
                    meta
                });
            }
        },
        delete: async () => {
            const q = generateDeleteString(structure, {
                where: [
                    {
                        name: idKey,
                        operator: '_eq',
                        value: data.form[idKey],
                        valueType: 'Int'
                    }
                ]
            });

            meta.loading.form = true;
            await queryAll(q.query, { auth });
            meta.mode = '';
            meta.loading.form = false;
            await reloadList({
                structure,
                paging,
                idKey,
                itemPerPage,
                data,
                loading: meta.loading,
                meta
            });
            if (onChange) {
                onChange({
                    action: 'delete',
                    form: data.form,
                })
            }
        },
        save: async () => {
            let q = null;

            switch (meta.mode) {
                case 'create':
                    q = generateInsertString(structure, toJS(data.form));
                    meta.loading.form = true;
                    const res = await queryAll(q.query, { variables: q.variables, auth });
                    await executeSubCrudActions(meta, res[idKey]);
                    await reloadList({
                        structure,
                        paging,
                        idKey,
                        itemPerPage,
                        data,
                        loading: meta.loading,
                        meta
                    });
                    meta.loading.form = false;
                    meta.mode = '';
                    data.form[idKey] = res[idKey];
                    if (onChange) {
                        onChange({
                            action: 'insert',
                            form: data.form,
                        })
                    }

                    break;
                case 'edit':
                    q = generateUpdateString(structure, toJS(data.form), {
                        where: [
                            {
                                name: idKey,
                                operator: '_eq',
                                value: data.form[idKey],
                                valueType: 'Int'
                            }
                        ]
                    });

                    meta.loading.form = true;
                    await queryAll(q.query, { variables: q.variables, auth });
                    await executeSubCrudActions(meta, data.form[idKey]);
                    await reloadList({
                        structure,
                        paging,
                        idKey,
                        itemPerPage,
                        data,
                        loading: meta.loading,
                        meta
                    });
                    meta.loading.form = false;
                    meta.mode = '';
                    if (onChange) {
                        onChange({
                            action: 'update',
                            form: data.form,
                        })
                    }
                    break;
                default:
                    meta.mode = '';
                    break;
            }

            data.form = {};
        },
        cancel: async () => {
            meta.mode = '';
            data.form = {};
            modifyBread(breadcrumbs, (bread) => {
                bread.title = `${bread.originalTitle}`;
            })
        }
    }
}