import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { DateTimeProps } from ".";
import { DefaultTheme } from "../../theme";
import { dateToString } from "../../utils";
import Icon from "../Icon";
import Input from "../Input";
import { createPortal } from "react-dom";

export default observer((props: DateTimeProps) => {
  const { value, style, mode, onFocus, onChange, showPicker } = props;
  const meta = useObservable({
    isShown: false,
    value: new Date(),
    dateString: {
      dd: "",
      mm: "",
      yyyy: ""
    },
    scrollH: 0,
    dimensions: null,
    contentHeight: 0
  });
  const theme = {
    ...DefaultTheme,
    ...props.theme
  };
  const onChangeDateString = (v, p) => {
    if (p === "dd") {
      v = v > 31 ? 31 : v < 0 ? 0 : v;
      meta.dateString[p] = v == 0 ? "" : ("0" + v).slice(-2);
    } else if (p === "mm") {
      v = v > 12 ? 12 : v < 0 ? 0 : v;
      meta.dateString[p] = v == 0 ? "" : ("0" + v).slice(-2);
    } else meta.dateString[p] = v;
    if (meta.dateString.dd && meta.dateString.mm && meta.dateString.yyyy) {
      let day = new Date(
        parseInt(meta.dateString.yyyy),
        parseInt(meta.dateString.mm),
        0
      ).getDate();
      if (parseInt(meta.dateString.dd) > day) meta.dateString.dd = `${day}`;
      meta.value = new Date(
        `${meta.dateString.yyyy}-${meta.dateString.mm}-${meta.dateString.dd}`
      );
      onChange && onChange(dateToString(meta.value));
    }
  };
  const onDayPress = dateString => {
    meta.value = new Date(dateString);
    meta.dateString.dd = ("0" + meta.value.getDate()).slice(-2);
    meta.dateString.mm = ("0" + (meta.value.getMonth() + 1)).slice(-2);
    meta.dateString.yyyy = `${meta.value.getFullYear()}`;
    onChange && onChange(dateString);
  };
  useEffect(() => {
    if (value) {
      let newDate;
      if (typeof value === "string") newDate = new Date(value);
      meta.value = newDate;
      meta.dateString.dd = ("0" + meta.value.getDate()).slice(-2);
      meta.dateString.mm = ("0" + (meta.value.getMonth() + 1)).slice(-2);
      meta.dateString.yyyy = `${meta.value.getFullYear()}`;
    }
  }, []);
  useEffect(() => {
    onFocus && onFocus(meta.isShown as any);
  }, [meta.isShown]);

  useEffect(() => {
    meta.isShown = showPicker;
  }, [showPicker]);
  return (
    <>
      <div
        style={{
          position: "initial",
          zIndex: meta.isShown ? 9 : 0,
          minWidth: 147,
          ...style
        }}
        ref={(ref: any) => {
          if (ref && !meta.dimensions) {
            const dimensions = ref.getBoundingClientRect();
            const parentDimension = ref.parentElement.parentElement.parentElement.getBoundingClientRect();
            meta.dimensions = dimensions;
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
            alignItems: "stretch"
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
              onChange={v => onChangeDateString(v, "dd")}
              onFocus={() => (meta.isShown = false)}
              returnKeyType="next"
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
              onChange={v => onChangeDateString(v, "mm")}
              onFocus={() => (meta.isShown = false)}
              returnKeyType="next"
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
              onChange={v => onChangeDateString(v, "yyyy")}
              onFocus={() => (meta.isShown = false)}
              returnKeyType="next"
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
              color={theme.dark}
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
  const { meta, theme, onDayPress, minDate, maxDate } = props;
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
  if (!loaded! || !meta.isShown) return null;
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: meta.dimensions.top,
        left: meta.dimensions.left,
        minHeight: 40,
        maxHeight: 350,
        backgroundColor: "#fff",
        zIndex: 9,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: theme.light,
        borderStyle: "solid",
        padding: 5,
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.16)",
        width: 260
      }}
    >
      <Calendar
        current={dateToString(meta.value)}
        onDayPress={day => {
          onDayPress(day.dateString);
          meta.isShown = false;
        }}
        style={styles.calendar}
        markedDates={{
          [dateToString(meta.value)]: {
            selected: true,
            selectedColor: theme.primary
          }
        }}
        minDate={minDate && dateToString(minDate)}
        maxDate={minDate && dateToString(maxDate)}
        renderArrow={direction => (
          <Icon
            source="Entypo"
            name={`chevron-${direction}`}
            color={theme.primary}
            size={24}
          />
        )}
        theme={{
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 14,
          textMonthFontSize: 14,
          textDayHeaderFontSize: 14
        }}
      />
    </div>,
    rootPortal
  );
});

const styles = StyleSheet.create({
  calendar: {
    height: 310,
    flex: 1
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
