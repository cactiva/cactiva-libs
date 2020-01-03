import React, { Suspense } from "react";
import { observer } from "mobx-react-lite";
import { ModalProps } from ".";

const Modal = React.lazy(() => import("modal-react-native-web"));
export default observer((props: ModalProps) => {
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <Modal
        ariaHideApp={false}
        animationType="slide"
        transparent={true}
        {...props}
      />
    </Suspense>
  );
});
