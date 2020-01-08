import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import SelectableRelations from "./SelectableRelations";
import SelectableSingle from "./SelectableSingle";

export default observer((props: any) => {
    const columns = _.get(props.relations, 'columns', []);
    if (columns.length <= 1) {
        return <SelectableSingle {...props} columns={columns} />;
    };

    return <SelectableRelations {...props} columns={columns} />
})

