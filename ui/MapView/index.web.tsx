import React from "react";
import { observer } from "mobx-react-lite";
import GoogleMapReact from 'google-map-react';
import { MapViewProps } from "./index";

export default observer((props: MapViewProps) => {
    const { location, style, zoom } = props;

    const mapStyle = {
        ...{
            width: '100%',
            height: '150px'
        },
        ...style
    }
    console.log(location);

    return <div style={mapStyle}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDsuqaKPSSiJiaU8mHfW6U19PqhwZKZNDw" }}
            defaultCenter={location || {
                latitude: -7.340851,
                longitude: 112.731968,
            }}
            defaultZoom={zoom || 11}
        >
        </GoogleMapReact>
    </div>;
});