import formatFNS from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { id, enUS } from "date-fns/locale";
import Theme from "@src/theme.json";

export const dateParse = (value: any) => {
  if (typeof value === "string") {
    return parseISO(value);
  }
  return value;
};
export const dateFormat = (value: any, format?: string) => {
  const locale = Theme.lang || "en";
  const inputFormat = format ? format : "dd MMM yyyy - HH:mm";
  if (typeof value === "string") {
    return formatFNS(parseISO(value), inputFormat, {
      locale: locale === "en" ? enUS : id
    });
  }

  try {
    return formatFNS(value, inputFormat, {
      locale: locales[locale]
    });
  } catch (e) {
    return value;
  }
};
