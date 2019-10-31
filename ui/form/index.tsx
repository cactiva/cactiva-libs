import { observer } from "mobx-react-lite";
import React from "react";
import Field, { FieldProps } from "../field";
import { uuid } from "../../utils";

export interface FormFieldProps extends FieldProps {
  key: string;
}

export interface FormProps {
  data: any;
  fields: FormFieldProps[];
  setValue?: (value: any, key: any) => void;
}

export default observer((props: FormProps) => {
  const { data, fields, setValue } = props;
  return (
    <>
      {fields.map(item => {
        return (
          <Field
            {...item}
            value={data[item.key]}
            setValue={v => {
              setValue(v, item.key);
            }}
            key={uuid(item.key)}
          />
        );
      })}
    </>
  );
});
