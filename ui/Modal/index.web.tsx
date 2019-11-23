import React from "react";
import { observer } from "mobx-react-lite";
import Modal from "modal-react-native-web";
import { ModalProps } from ".";

export default observer((props: ModalProps) => {
  return <Modal animationType="slide" transparent={true} {...props} />;
});
