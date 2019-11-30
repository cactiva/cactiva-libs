import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Image, ImageProps } from "react-native";
import Spinner from "../Spinner";
import View from "../View";

const errorSource = require("@src/assets/images/404.png");

export default observer((props: ImageProps) => {
  const meta = useObservable({
    status: "init"
  });
  const style: any = _.get(props, "style", {});

  return (
    <>
      {meta.status !== "error" && (
        <Image
          {...props}
          onLoad={() => {
            meta.status = "ready";
          }}
          onLoadStart={() => {
            meta.status = "loading";
          }}
          onError={e => {
            meta.status = "error";
          }}
          style={{
            ...style,
            opacity: meta.status === "ready" ? 1 : 0
          }}
        />
      )}
      <RenderImage imgProps={props} meta={meta} />
    </>
  );
});

const RenderImage = observer((props: any) => {
  const { imgProps, meta } = props;
  if (meta.status === "init" || meta.status === "ready") {
    return null;
  }
  return (
    <View
      style={{
        ..._.get(imgProps, "style", {}),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0
      }}
    >
      {meta.status === "loading" ? (
        <Spinner size={"large"} />
      ) : (
        <Image
          resizeMode={"contain"}
          source={errorSource}
          style={_.get(imgProps, "style", {})}
        />
      )}
    </View>
  );
});
