import { queryAll } from '@src/libs/utils/gql';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { Icon, Table, TableColumn, TableHead, TableRow, Spinner } from '../..';
import { toJS } from 'mobx';

export default observer(({ mode, relations, fk, value, auth, filter, meta, onSelect, style }: any) => {
    const cols = _.get(relations, 'columns', []);
    const colHeads = generateCols(cols);
    const colRows = generateCols(cols);
    const onPress = meta.isPreview ? undefined : (e, p) => {
        if (mode === 'filter') {
            meta.list[p].__checked = !meta.list[p].__checked;
        } else {
            if (meta.preview) {
                meta.preview.list = [e];
            }
            onSelect(e['id']);
            meta.modal = false;
        }
    };
    if (mode === 'filter' && !meta.isPreview) {
        colHeads.unshift(<TableColumn key={-1} path="__checked" title="" style={{ flexBasis: 30, flexGrow: 0 }}>
            <TouchableOpacity onPress={(e) => {
                meta.selectedAll = !meta.selectedAll;
                meta.list = meta.list.map(e => {
                    return {
                        ...e,
                        __checked: meta.selectedAll
                    }
                });
            }}>
                <Icon source={"Feather"} name={meta.selectedAll ? "check-square" : "square"} size={20}></Icon>
            </TouchableOpacity>
        </TableColumn>)
        colRows.unshift(<TableColumn key={-1} path="__checked" title="" style={{ flexBasis: 30, flexGrow: 0 }}>{(e) => {
            if (!e) {
                return <Icon source={"Feather"} name={"square"} size={20}></Icon>
            }
            return <Icon source={"Feather"} name={"check-square"} size={20}></Icon>;
        }}</TableColumn>)
    }
    useAsyncEffect(async () => {
        if (fk) {
            if (meta.list.length === 0 || meta.isPreview) {
                meta.loading = true;
                let where = ``;
                if (meta.isPreview) {
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            where = `(where: { id: { _in: ${JSON.stringify(value)} } })`;
                        } else {
                            meta.list = [];
                            return;
                        }
                    } else if (value) {
                        where = `(where: { id: { _eq: ${value} } })`;
                    }
                }

                const q = `{ 
                ${fk.foreign_table_name}${where} {
${cols.map((e) => {
                    return recurseMap(e);
                }).join('\n')}
}
}`
                meta.list = (await queryAll(q, { auth }) || []);

                meta.loading = false;
            }

            meta.list = meta.list.map(e => {
                if (Array.isArray(toJS(value))) {
                    if (value.indexOf(e['id']) >= 0) {
                        e.__checked = true;
                        return e;
                    }
                }
                delete e.__checked;
                return e;
            })
        }
    }, [fk, value])

    if (meta.loading) return <Spinner />

    return <Table
        columnMode="manual"
        style={{ flex: 1, ...style }}
        data={meta.list}>
        <TableHead style={{ backgroundColor: meta.isPreview ? 'white' : undefined }}>
            {colHeads}
        </TableHead>
        <TableRow onPress={onPress}>
            {colRows}
        </TableRow>
    </Table>
});

const recurseMap = e => {
    if (typeof e === 'string') {
        return e;
    } else if (typeof e === 'object') {
        return `${e.field} { \n\t ${e.columns.map(f => recurseMap(f)).join('\n\t')} \n }`;
    }
}

const generateCols = (cols) => {
    return cols.map((e, idx) => {
        if (typeof e === 'string') {
            if (e.indexOf('id') !== 0) {
                return <TableColumn
                    key={idx}
                    path={e}
                    title={_.startCase(e)}
                ></TableColumn>
            }
        }

        if (typeof e === 'object') {
            if (e.field.indexOf('id') !== 0) {
                return <TableColumn
                    key={idx}
                    path={e.field}
                    title={e.label}
                ></TableColumn>
            }
        }
    }).filter(e => !!e)
}