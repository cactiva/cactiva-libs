import { observer } from "mobx-react-lite";
import React from "react";
import MapView, { MapViewProps as MapViewPropsOrigin, Marker as MarkerOrigin, MarkerProps } from "react-native-maps";
import View from "../View";

export interface MapViewProps extends MapViewPropsOrigin {
  style?: any;
  location?: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MarkerProps[];
  children?: any;
}
export default observer((props: MapViewProps) => {
  const { style, children } = props;
  const mapProps = props;
  delete mapProps.markers;
  const initial = {
    latitude: -2.3932595,
    longitude: 108.8485046,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return (
    <View style={style}>
      <MapView
        initialRegion={initial}
        style={{
          flexGrow: 1
        }}
        {...mapProps}
      >
        {children}
        {/* {markers &&
          markers.length > 0 &&
          markers.map(marker => <Marker key={uuid()} {...marker} />)} */}
      </MapView>
    </View>
  );
});

export const Marker = observer((props: MarkerProps) => {
  return <MarkerOrigin {...props} />;
});
