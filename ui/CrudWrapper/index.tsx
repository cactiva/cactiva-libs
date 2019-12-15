import { generateQueryString } from '@src/libs/utils/genQueryString';
import { queryAll } from '@src/libs/utils/gql';
import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import useAsyncEffect from "use-async-effect";
import Form from '../Form';
import Table from '../Table';
import View from '../View';
import BaseTemplate from './BaseTemplate';
import Text from '../Text';
import TableRow from '../Table/TableRow';
import TableHead from '../Table/TableHead';
import { generateInsertString } from '@src/libs/utils/genInsertString';
import { generateUpdateString } from '@src/libs/utils/genUpdateString';
import { toJS } from 'mobx';
import { generateDeleteString } from '@src/libs/utils/genDeleteString';


export default observer(({ data, children, template, idKey = "id", itemPerPage = 25 }: any) => {
    const structure = _.get(data, 'structure', null);
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
    const meta = useObservable({
        mode: '',
        loading: {
            list: false,
            form: false
        }
    });

    const castedIdKey = _.startCase(idKey);

    children.map((e) => {
        if (e.type === Table) {
            props.table.root = { ...e.props };
            _.castArray(e.props.children).map(c => {
                if (c.type === TableRow) {
                    props.table.row = {
                        ...c.props, children: _.castArray(c.props.children).filter(r => {
                            return r.props.path !== idKey;
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
        } else if (e.type === View) {
            props.actions = { ...e.props };
        } else {
            props.form = e;
        }
    })

    const reloadList = async () => {
        if (structure) {
            meta.loading.list = true;
            const currentPage = _.get(paging, 'current', 1)
            const query = generateQueryString({
                ...structure, options: {
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
                    data.list = e;
                }
            });
            meta.loading.list = false;
        }
    };
    useAsyncEffect(reloadList, [structure]);

    return <Template {...data}
        paging={paging}
        props={props} idKey={idKey} mode={meta.mode} loading={meta.loading} actions={{
            edit: (input) => {
                meta.mode = 'edit';
                data.form = input;
            },
            create: () => {
                meta.mode = 'create';
            },
            prevPage: () => {
                if (paging.current - 1 > 0) {
                    paging.current--;
                    reloadList();
                }
            },
            nextPage: () => {
                if (paging.current + 1 <= paging.total) {
                    paging.current++;
                    reloadList();
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
                await reloadList();
            },
            save: async () => {
                let q = null;

                switch (meta.mode) {
                    case 'create':
                        q = generateInsertString(structure, toJS(data.form));

                        meta.loading.form = true;
                        await queryAll(q.query, { variables: q.variables, auth });
                        meta.mode = '';
                        meta.loading.form = false;
                        await reloadList();
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
                        meta.mode = '';
                        meta.loading.form = false;
                        await reloadList();
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
            }
        }} />;
});