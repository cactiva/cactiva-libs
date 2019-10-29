import { Platform } from "react-native";

export interface UIThemeProps {
  primary: string;
  secondary: string;
  light: string;
  dark: string;
  accent: string;
  background: string;
}

export const Theme = {
  primary: "#44599D",
  secondary: "#EEF1FB",
  dark: "#1D284F",
  light: "#4DB7A1",
  accent: "#804D7C",
  background: "#F8FAFB"
};

export const GlobalStyle = {
  safeAreaView: {
    marginTop: Platform.OS === "android" ? 30 : 0
  }
};
