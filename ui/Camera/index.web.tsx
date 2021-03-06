import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect, useState, Suspense } from "react";
import { createPortal } from "react-dom";
import { Image, TouchableOpacity, View } from "react-native";
import { useDimensions } from "react-native-hooks";
import { CameraProps } from ".";
import { DefaultTheme } from "../../theme";
import Icon from "../Icon";


const Webcam: any = React.lazy(() => import("react-webcam"));
export default observer((props: CameraProps) => {
  const theme = {
    ...DefaultTheme,
    ...props.theme
  };
  const { style, value } = props;
  const dim = useDimensions().window;
  const webcamRef = React.useRef(null);
  const meta = useObservable({
    hasCameraPermission: null,
    isShown: false,
    cameraProps: {
      width: 1280,
      height: 720,
      facingMode: "user"
    },
    snap: false,
    photo: null,
    ref: false,
    resnap: false
  });
  const capture = React.useCallback(() => {
    meta.isShown = false;
    meta.photo = webcamRef.current.getScreenshot();
  }, [webcamRef]);

  return (
    <>
      <TouchableOpacity
        onPress={() => (meta.isShown = true)}
        style={{
          flex: 1,
          height: 100,
          backgroundColor: theme.medium,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          overflow: "hidden",
          ...style
        }}
      >
        {(meta.photo || value) && (
          <Image
            source={{
              uri: meta.photo ? meta.photo : value
            }}
            resizeMode="cover"
            style={{
              height: 100,
              width: dim.width,
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0
            }}
          />
        )}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            zIndex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <Icon source="Entypo" name="camera" size={45} color="white" />
        </View>
      </TouchableOpacity>
      {meta.isShown && (
        <ModalCamera
          videoConstraints={meta.cameraProps}
          webcamRef={webcamRef}
          capture={capture}
        />
      )}
    </>
  );
});

const ModalCamera = ({ videoConstraints, webcamRef, capture }: any) => {
  const [loaded, setLoaded] = useState(false);
  const rootPortal = document.getElementById("root-portal");
  useEffect(() => {
    const iv = setInterval(() => {
      const rootPortal = document.getElementById("root-portal");
      if (rootPortal) {
        setLoaded(true);
        clearInterval(iv);
      }
    }, 100);
  }, []);

  if (!loaded) return null;
  return createPortal(
    <div
      onClick={capture}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "white"
      }}
    >

      <Suspense fallback={<div>Loading... </div>}><Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      /></Suspense>
    </div>,
    rootPortal
  );
};
