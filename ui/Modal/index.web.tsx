import React, { Suspense } from "react";
import { observer } from "mobx-react-lite";
import { ModalProps } from ".";
import Text from "../Text";

const Modal = React.lazy(() => import("modal-react-native-web"));
export default observer((props: ModalProps) => {
  return (
    <Suspense fallback={<Text>Loading... </Text>}>
      <Modal
        ariaHideApp={false}
        animationType="slide"
        transparent={true}
        {...props}
      />
    </Suspense>
  );
});
