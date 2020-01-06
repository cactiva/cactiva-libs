import api from '@src/libs/utils/api';
import { queryAll } from '@src/libs/utils/gql';
import { observable, toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import useAsyncEffect from 'use-async-effect';
import { Select } from '..';

const tables = observable({});

export default observer(({ fk, field, value, onSelect, onFocus, valuePath, labelPath }: any) => {
    const meta = useObservable({
        data: []
    });
    useAsyncEffect(async () => {
        if (!tables[fk.foreign_table_name]) {
            const res = await api({ url: `/api/db/columns?table=${fk.foreign_table_name}` }) as any[];
            if (res) {
                tables[fk.foreign_table_name] = {
                    columns: res,
                    data: []
                };
            }
        }
        const table = tables[fk.foreign_table_name];
        if (table) {
            meta.data = table.data;
            if (table.data.length === 0) {
                const res = await queryAll(`query {
            ${fk.foreign_table_name} {
                ${table.columns
                        .filter(e => {
                            if (e.column_name === 'id') return true;
                            return e.column_name.indexOf('id') !== 0
                        })
                        .map(e => e.column_name)
                        .join('\n')}
            }
        }`, { auth: true });

                if (Array.isArray(res)) {
                    meta.data = res.map(e => {
                        const keys = Object.keys(e);
                        return {
                            ...e,
                            value: e.id,
                            label: e[keys[1]]
                        }
                    })

                    table.data = toJS(meta.data);
                }
            }
        }
    }, []);
    return <Select
        items={meta.data}
        value={value}
        onSelect={onSelect}
        onFocus={onFocus}
        valuePath={valuePath}
        labelPath={labelPath} />;
})