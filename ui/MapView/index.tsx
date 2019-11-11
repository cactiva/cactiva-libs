import React from "react";
import { observer } from "mobx-react-lite";

export interface MapViewProps { style?: any, location?: { latitude: number, longitude: number }, zoom?: number }
export default observer((props: MapViewProps) => {
    const { style } = props;
    return <div style={style}>
        MapView not ready yet in Mobile
    </div>;
});