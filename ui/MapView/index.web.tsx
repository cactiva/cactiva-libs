import ErrorBoundary from "@src/libs/ErrorBoundary";
import { observer } from "mobx-react-lite";
import React from "react";
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
// import { GoogleLayer } from 'react-leaflet-google-v2';
import { GoogleMap, Marker as MarkerComponent, withGoogleMap, withScriptjs } from "react-google-maps";
import { Text, View } from "react-native";
import { MapViewProps } from "./index";
import { Platform } from "@unimodules/core";

export const Marker = MarkerComponent;
const MapViewInner = observer((props: MapViewProps) => {
  const { location, style, zoom } = props;

  let center = { lat: -7.340851, lng: 112.731968 } as any;
  if (location) {
    center = { lat: location.latitude, lng: location.longitude };
  }
  return (
    <GoogleMap
      defaultZoom={zoom || 15}
      defaultCenter={center}
      defaultOptions={{
        zoomControl: false,
        disableDefaultUI: true,
        fullscreenControl: false
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
});

export default (props: MapViewProps) => {
  if (Platform.OS !== "web") return <Text>Wrong OS</Text>;
  const MapView = withScriptjs(withGoogleMap(MapViewInner));

  const mapStyle = {
    ...{
      width: "100%",
      height: "250px",
      overflow: "hidden"
    },
    ...props.style
  }
  return <ErrorBoundary errorComponent={<View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <Text style={{ fontSize: 16 }}>Maps is unavailable</Text>
  </View>}>
    <MapView
      {...props}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
        "AIzaSyD-6dn4tHXYdHJNZLGmQvvNSgL4elJPGSY"
        }`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={mapStyle} />}
      mapElement={<div style={{ height: `100%` }} />} />
  </ErrorBoundary>
}


