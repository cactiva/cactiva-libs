import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor: number = 0.5) =>
  size + (scale(size) - size) * factor;
const uuid = (prefix: string = randString()) =>
  `${prefix}-${new Date().getTime()}${Math.floor(
    10000000 + Math.random() * 90000000
  )}`;

const randString = (length: number = 5) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export { scale, verticalScale, moderateScale, uuid, randString };
export { default as Icon } from "./icon";
export { default as Input } from "./input/index";
export { default as Select } from "./select";
