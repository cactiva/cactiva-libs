import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { ThemeProps, DefaultTheme } from "../../theme";
import Icon from "../icon";
import Input, { InputProps } from "../input";
import { dateToString } from "../../utils";

export interface DateTimeProps extends InputProps {
  mode?: "date" | "time";
  display?: "default" | "spinner";
  maximumDate?: Date;
  minimumDate?: Date;
  theme?: ThemeProps;
  value: any;
  onFocus?: (e: any) => void;
}

export default observer((props: DateTimeProps) => {
  const {
    value,
    style,
    mode,
    display,
    minimumDate,
    maximumDate,
    onFocus,
    onChangeText
  } = props;
  const meta = useObservable({
    isShown: false,
    value: new Date(),
    dateString: {
      dd: "",
      mm: "",
      yyyy: ""
    },
    position: "",
    scrollH: 0
  });
  const theme = {
    ...DefaultTheme,
    ...props.theme
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
  const onDayPress = dateString => {
    meta.value = new Date(dateString);
    meta.dateString.dd = ("0" + meta.value.getDate()).slice(-2);
    meta.dateString.mm = ("0" + (meta.value.getMonth() + 1)).slice(-2);
    meta.dateString.yyyy = `${meta.value.getFullYear()}`;
    onChangeText && onChangeText(dateString);
  };
  useEffect(() => {
    if (value) {
      if (typeof value === "string") meta.value = new Date(value);
      else meta.value = value;
    }
  }, []);
  useEffect(() => {
    onFocus && onFocus(meta.isShown);
  }, [meta.isShown]);

  return (
    <>
      <div
        style={{
          flex: 1,
          position: "initial",
          zIndex: meta.isShown ? 9 : 0
        }}
        ref={(ref: any) => {
          if (ref) {
            const dimensions = ref.getBoundingClientRect();
            const parentDimension = ref.parentElement.parentElement.parentElement.getBoundingClientRect();
            const scrollH =
              ref.parentElement.parentElement.parentElement.scrollHeight;
            if (dimensions.y + dimensions.height + 350 > scrollH) {
              meta.position = "bottom";
            } else {
              meta.position = "top";
            }
            meta.scrollH = parentDimension.bottom;
          }
        }}
      >
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
              onDayPress(dateToString(meta.value));
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
        <CalendarDropdown
          {...props}
          meta={meta}
          theme={theme}
          onDayPress={onDayPress}
        />
      </div>
      {meta.isShown && (
        <div
          onClickCapture={e => {
            e.stopPropagation();
            e.preventDefault();
            meta.isShown = false;
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            bottom: 0,
            height: meta.scrollH,
            display: "flex"
          }}
        />
      )}
    </>
  );
});

const CalendarDropdown = observer((props: any) => {
  const { meta, theme, onDayPress } = props;

  return (
    <>
      {meta.isShown && (
        <View
          style={{
            position: "absolute",
            bottom: meta.position === "bottom" ? 35 : null,
            top: meta.position === "top" ? 35 : null,
            left: 0,
            right: 0,
            minHeight: 40,
            maxHeight: 350,
            backgroundColor: "#fff",
            zIndex: 9,
            borderTopLeftRadius: meta.position === "bottom" ? 5 : 0,
            borderTopRightRadius: meta.position === "bottom" ? 5 : 0,
            borderBottomLeftRadius: meta.position === "top" ? 5 : 0,
            borderBottomRightRadius: meta.position === "top" ? 5 : 0,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-start",
            borderWidth: 1,
            borderColor: theme.light,
            borderStyle: "solid",
            borderTopWidth: meta.position === "bottom" ? 1 : 0,
            borderBottomWidth: meta.position === "top" ? 1 : 0,
            padding: 5
          }}
        >
          <Calendar
            onDayPress={day => onDayPress(day.dateString)}
            style={styles.calendar}
            markedDates={{
              [dateToString(meta.value)]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange"
              }
            }}
          />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  calendar: {
    height: 305
  },
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10,
    backgroundColor: "#eee"
  },
  container: {
    flex: 1,
    backgroundColor: "gray"
  }
});
