import { format as formatFNS, parseISO } from "date-fns";
export const dateParse = (value: any) => {
    if (typeof value === 'string') {
        return parseISO(value);
    }
    return value;
}
export const dateFormat = (value: any, format?: string) => {
    const inputFormat = format ? format : 'dd MMM yyyy - HH:mm';
    if (typeof value === 'string') {
        return formatFNS(parseISO(value), inputFormat);
    }

    try {
        return formatFNS(value, inputFormat);
    } catch (e) {
        return value;
    }
};