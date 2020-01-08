import api from '@src/libs/utils/api';
import { queryAll } from '@src/libs/utils/gql';
import { observable, toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import React from 'react';
import useAsyncEffect from 'use-async-effect';
import { Select } from '../..';
import { columnDefs } from "../index";

export default observer(({ columns, fk, label, field, auth, value, onSelect, onFocus, valuePath, labelPath }: any) => {
    const meta = useObservable({
        data: [],
        modal: false,
    });

    useAsyncEffect(async () => {
        if (!columnDefs[fk.foreign_table_name]) {
            const res = await api({ url: `/api/db/columns?table=${fk.foreign_table_name}` }) as any[];
            if (res) {
                columnDefs[fk.foreign_table_name] = {
                    columns: res,
                    data: []
                };
            }
        }
        const table = columnDefs[fk.foreign_table_name];
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
        }`, { auth });
                if (Array.isArray(res)) {
                    meta.data = res.map(e => {
                        let key = null;

                        if (columns.length > 0) {
                            key = columns[0];
                        } else {
                            const keys = Object.keys(e);
                            key = keys[1];
                        }

                        return {
                            ...e,
                            value: e.id,
                            label: e[key]
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
        onSelect={(value) => onSelect(value !== "object" ? value : value.value || value.label)}
        onFocus={onFocus}
        valuePath={valuePath}
        labelPath={labelPath} />;
})