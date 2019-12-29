import React from 'react';
import { toJS } from 'mobx';

export default ({ fk, field }: any) => {
    console.log(toJS(fk), field);
    return <div></div>;
}