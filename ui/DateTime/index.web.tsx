import { DefaultTheme } from "@src/libs/theme";
import { dateParse } from '@src/libs/utils/date';
import Theme from "@src/theme.json";
import _ from 'lodash';
import React, { Suspense } from 'react';
import "./web/datetime.css";
const theme = {
    ...DefaultTheme,
    ...Theme.colors
};

let DateTime = React.lazy(() => import("./web"));
export default (props: any) => {
    return <Suspense fallback={<div>Loading... </div>}>
        <DateTime {...props} value={dateParse(props.value)}
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
            }} />
    </Suspense>;
}