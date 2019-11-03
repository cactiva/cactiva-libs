import React, { useEffect } from "react";
import { observer, useObservable } from "mobx-react-lite";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  DatePickerAndroid,
  DatePickerIOS,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { ThemeProps, DefaultTheme } from "../../theme";
import Input, { InputProps } from "../input";
import Icon from "../icon";
import { dateToString } from "../../utils";
import _ from "lodash";

export interface DateTimeProps extends InputProps {
  mode?: "date" | "time";
  // display?: "default" | "spinner";
  maxDate?: Date;
  minDate?: Date;
  theme?: ThemeProps;
  value: any;
}

export default observer((props: DateTimeProps) => {
  const { value, style, mode, onChangeText } = props;
  const meta = useObservable({
    isShown: false,
    value: new Date(),
    dateString: {
      dd: "",
      mm: "",
      yyyy: ""
    }
  });

  const theme = {
    ...DefaultTheme,
    ..._.get(props, "theme", {})
  };
  const onChangeDateString = (v, p) => {
    if (p === "dd" || p === "mm") meta.dateString[p] = ("0" + v).slice(-2);
    else meta.dateString[p] = v;
    if (meta.dateString.dd && meta.dateString.mm && meta.dateString.yyyy) {
      meta.value = new Date(
        `${meta.dateString.yyyy}-${meta.dateString.mm}-${meta.dateString.dd}`
      );
      onChangeText && onChangeText(dateToString(meta.value));
    }
  };
  const onChangePicker = date => {
    meta.value = date;
    meta.dateString.dd = ("0" + meta.value.getDate()).slice(-2);
    meta.dateString.mm = ("0" + (meta.value.getMonth() + 1)).slice(-2);
    meta.dateString.yyyy = `${meta.value.getFullYear()}`;
    onChangeText && onChangeText(dateToString(date));
  };
  useEffect(() => {
    if (value) {
      if (typeof value === "string") meta.value = new Date(value);
      else meta.value = value;
    }
  }, [value]);
  return (
    <>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          ...style
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Input
            placeholder="dd"
            style={{
              width: 30
            }}
            type="number"
            value={meta.dateString.dd}
            onChangeText={v => onChangeDateString(v, "dd")}
          />
          <Text
            style={{
              paddingRight: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            /
          </Text>
          <Input
            placeholder="mm"
            style={{
              width: 30
            }}
            type="number"
            value={meta.dateString.mm}
            onChangeText={v => onChangeDateString(v, "mm")}
          />
          <Text
            style={{
              paddingRight: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            /
          </Text>
          <Input
            placeholder="yyyy"
            style={{
              width: 60
            }}
            type="number"
            value={meta.dateString.yyyy}
            onChangeText={v => onChangeDateString(v, "yyyy")}
          />
        </View>
        <TouchableOpacity
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 5,
            paddingRight: 5
          }}
          onPress={e => {
            e.stopPropagation();
            e.preventDefault();
            meta.isShown = !meta.isShown;
            if (Platform.OS === "ios") {
              onChangePicker(meta.value);
            }
          }}
        >
          <Icon
            source="Ionicons"
            name={mode === "time" ? "md-time" : "md-calendar"}
            color={theme.dark}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <DatePickerModal meta={meta} {...props} onChangePicker={onChangePicker} />
    </>
  );
});

const DatePickerModal = observer((props: any) => {
  const { meta, mode, onChangePicker, minDate, maxDate } = props;
  if (meta.isShown && Platform.OS === "android") {
    const loadPicker = async () => {
      try {
        const { action, year, month, day }: any = await DatePickerAndroid.open({
          date: new Date(meta.value),
          mode: mode || "calendar",
          minDate: minDate,
          maxDate: maxDate
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          onChangePicker(new Date(`${year}-${month}-${day}`));
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    };
    loadPicker();
    meta.isShown = false;
    return null;
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={meta.isShown}
      onRequestClose={() => {
        meta.isShown = false;
      }}
    >
      <View
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
          height: 200,
          backgroundColor: "#fff",
          zIndex: 9
        }}
      >
        <DatePickerIOS
          date={meta.value}
          onDateChange={onChangePicker}
          mode={mode || "date"}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      </View>
      <TouchableWithoutFeedback onPress={() => (meta.isShown = false)}>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,.3)"
          }}
        />
      </TouchableWithoutFeedback>
    </Modal>
  );
});
