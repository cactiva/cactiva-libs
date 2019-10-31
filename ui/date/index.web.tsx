import React, { useEffect, useRef } from "react";
import { observer, useObservable } from "mobx-react-lite";
import { View, Text, TouchableOpacity } from "react-native";
import { InputProps } from "../input";
import { ThemeProps } from "../../theme";
import { Input, Icon } from "..";

export interface DateTimeProps extends InputProps {
  mode?: "date" | "time";
  display?: "default" | "spinner";
  maximumDate?: Date;
  minimumDate?: Date;
  theme?: ThemeProps;
  value: any;
}

export default observer((props: DateTimeProps) => {
  const { value, style, mode, display, minimumDate, maximumDate } = props;
  const meta = useObservable({
    isShown: false,
    value: null,
    dateString: {
      dd: "",
      mm: "",
      yyyy: ""
    }
  });
  const onChangeDateString = (v, p) => {
    if (p === "dd" || p === "mm") meta.dateString[p] = ("0" + v).slice(-2);
    else meta.dateString[p] = v;
    if (meta.dateString.dd && meta.dateString.mm && meta.dateString.yyyy) {
      meta.value = new Date(
        `${meta.dateString.yyyy}-${meta.dateString.mm}-${meta.dateString.dd}`
      );
    }
  };
  const onChangePicker = (e, d) => {
    console.log(e, d);
  };
  useEffect(() => {
    if (value) {
      if (typeof value === "string") meta.value = new Date(value);
      else meta.value = value;
    }
  }, []);

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
            justifyContent: "flex-start"
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
          }}
        >
          <Icon
            source="Ionicons"
            name={mode === "time" ? "md-time" : "md-calendar"}
            color="#3a3a3a"
            size={20}
          />
        </TouchableOpacity>
      </View>
    </>
  );
});
