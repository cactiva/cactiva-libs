import React from 'react';
import { observer } from 'mobx-react-lite';
import EmptyCell from '../Table/EmptyCell';
import Text from '../Text';
import _ from 'lodash';

export default observer(({ value }: any) => {
    let valueEl = null;
    if (typeof value === 'object') {
        if (value === null) {
            valueEl = <EmptyCell />
        } else {
            const keys = Object.keys(value);
            valueEl = keys.length === 1
                ? <Text>{value[keys[0]]}</Text>
                : <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                    {keys.map((key: string) => {
                        return <tr key={key} style={{ verticalAlign: 'top' }}>
                            <td style={{
                                border: '1px solid #ddd',
                                padding: 6, paddingTop: 2, paddingBottom: 2
                            }}>
                                <Text style={{ fontSize: 12 }}>
                                    {_.startCase(key)}
                                </Text>
                            </td>
                            <td style={{
                                border: '1px solid #ddd',
                                padding: 6, paddingTop: 2, paddingBottom: 2
                            }}>
                                <Text style={{ fontSize: 12 }}>
                                    {value[key]}
                                </Text>
                            </td>
                        </tr>
                    })}
                </table>
        }
    } else {
        valueEl = <Text>{value}</Text>
    }
    return valueEl;
});