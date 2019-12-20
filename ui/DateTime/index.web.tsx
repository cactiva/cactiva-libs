import { dateParse } from '@src/libs/utils/date';
import Theme from "@src/theme.json";
import _ from 'lodash';
import React from 'react';
import "./datetime.css";
import DateTime from "./web";
import { DefaultTheme } from "@src/libs/theme";
const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

export default (props: any) => {
    return <DateTime {...props} value={dateParse(props.value)}
        className="datetime"
        dateFormat="dd MMM yyyy -"
        timeFormat="HH:mm"
        style={{
            border: 0,
            minHeight: 30,
            fontSize: 14,
            color: theme.dark,
            fontFamily: _.get(Theme, "fontFamily", undefined),
            ...props.style
        }} />;
}