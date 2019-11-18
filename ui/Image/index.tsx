import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { Image, ImageProps } from "react-native";
import Spinner from "../Spinner";
import View from "../View";

const errorSource = require("@src/assets/images/404.jpg");

export default observer((props: ImageProps) => {
  const meta = useObservable({
    status: "init"
  });
  return (
    <>
      {meta.status !== "error" && (
        <Image
          {...props}
          onLoad={() => (meta.status = "ready")}
          onLoadStart={() => (meta.status = "loading")}
          onError={e => {
            meta.status = "error";
          }}
          style={{
            ...(_.get(props, "style", {}) as any),
            display: meta.status === "ready" ? undefined : "none"
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
        alignItems: "center"
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
