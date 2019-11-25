import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import MapViewNative, {
  MapViewProps as MapViewPropsOrigin,
  Marker as MarkerOrigin,
  MarkerProps
} from "react-native-maps";
import View from "../View";

export interface MapViewProps extends MapViewPropsOrigin {
  style?: any;
  location?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  zoom?: number;
  markers?: MarkerProps[];
  markerIds?: string[];
  children?: any;
  fitToSuppliedMarkers?: boolean;
}
export default observer((props: MapViewProps) => {
  const { style, children, location, fitToSuppliedMarkers, markerIds } = props;
  const mapProps = { ...props };
  delete mapProps.markers;
  delete mapProps.location;
  const meta = useObservable({
    region: {
      latitude: -0.7056041715972583,
      longitude: 118.81669320395446,
      latitudeDelta: 61.50892138363919,
      longitudeDelta: 44.72305383294736
    },
    defaultLatitudeDelta: 0.0922,
    defaultLongitudeDelta: 0.0922,
    mapReady: false,
    ref: null
  });
  const mapRef = useRef(null);
  let region = { ...meta.region };

  useEffect(() => {
    if (
      fitToSuppliedMarkers !== false &&
      mapRef.current !== null &&
      meta.mapReady &&
      markerIds.length > 0
    ) {
      setTimeout(() => {
        mapRef.current.fitToSuppliedMarkers(markerIds);
      });
    }
  }, [meta.mapReady, markerIds]);

  useEffect(() => {
    if (!!location) {
      let newregion: any = location;
      if (!newregion.latitudeDelta) {
        newregion.latitudeDelta = meta.defaultLatitudeDelta;
      }
      if (!newregion.longitudeDelta) {
        newregion.longitudeDelta = meta.defaultLongitudeDelta;
      }
      meta.region = newregion;
    }
  }, [location]);

  return (
    <View
      style={style}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        meta.defaultLongitudeDelta =
          (meta.defaultLatitudeDelta + width / height) * 10;
      }}
    >
      <MapViewNative
        ref={mapRef}
        onMapReady={() => {
          meta.mapReady = true;
        }}
        style={{
          flexGrow: 1
        }}
        region={region}
        {...mapProps}
      >
        {children}
        {/* {markers &&
          markers.length > 0 &&
          markers.map(marker => <Marker key={uuid()} {...marker} />)} */}
      </MapViewNative>
    </View>
  );
});

export const Marker = observer((props: MarkerProps) => {
  return <MarkerOrigin {...props} />;
});

export function getRegionForCoordinates(points) {
  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY;

  // init first point
  (point => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map(point => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = maxX - minX;
  const deltaY = maxY - minY;

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
}
