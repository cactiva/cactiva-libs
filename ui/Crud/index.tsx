import React, { useEffect } from "react";
import { observer, useObservable } from "mobx-react-lite";
import View from "../View";
import Table, { TableProps, TableFieldProps } from "../Table";
import { ViewStyle } from "react-native";
import FormJson, { FormFieldProps } from "../FormJson";
import Text from "../Text";
import Modal from "../Modal";
import Header from "../Header";
import Button from "../Button";
import _ from "lodash";

interface CrudFieldProps extends TableFieldProps {}

export interface ConfigCrudProps {
  primary: string;
  fields: CrudFieldProps[];
  table?: {
    onScrollEnd?: () => void;
    onFilter?: (filter) => void;
    onSearch?: (text) => void;
    onSelect?: (item) => void;
  };
}

export interface CrudProps {
  data: any[];
  config: ConfigCrudProps;
  loading?: boolean;
  style?: ViewStyle;
}

export default observer((props: CrudProps) => {
  const { data, config, style, loading } = props;
  const meta = useObservable({
    loading: false,
    data: [],
    selected: null,
    isShownDetail: false,
    detailMode: "view"
  });
  const tableProps = config.table;
  tableProps.onSelect = item => {
    meta.selected = item;
    meta.isShownDetail = true;
    meta.detailMode = "view";
  };
  useEffect(() => {
    meta.loading = loading;
  }, [loading]);

  useEffect(() => {
    meta.data = [...data];
  }, [data]);
  return (
    <View type={"ScrollView"} horizontal={true} style={style}>
      <Table
        data={data}
        config={{
          primary: config.primary,
          fields: config.fields
        }}
        loading={meta.loading}
        {...tableProps}
        style={{
          flexGrow: 1
        }}
      ></Table>
      <DetailView meta={meta} config={config}></DetailView>
    </View>
  );
});

const DetailView = observer((props: any) => {
  const { meta, config } = props;
  const form = useObservable({
    data: {}
  });
  const primaryKey = config.primary;
  const fields = config.fields;
  const filterField = [];
  fields.map(field => {
    if (field.name === primaryKey) _.set(field, "field.editable", false);
    field.path = field.name;
    filterField.push(field);
  });
  useEffect(() => {
    form.data = { ...meta.selected };
  }, [meta.selected]);
  return (
    <Modal
      visible={meta.isShownDetail}
      onRequestClose={() => (meta.isShownDetail = false)}
      transparent={false}
    >
      <Header
        title={meta.detailMode === "view" ? "Detail" : "Edit"}
        backBtn={true}
        onPressBackBtn={() => (meta.isShownDetail = false)}
      >
        {meta.detailMode === "view" ? (
          <>
            <Button
              style={{
                marginRight: 10
              }}
              onPress={() => {
                meta.detailMode = "edit";
              }}
            >
              <Text>Edit</Text>
            </Button>
            <Button>
              <Text>Delete</Text>
            </Button>
          </>
        ) : (
          <Button
            onPress={() => {
              meta.detailMode = "view";
            }}
          >
            <Text>Cancel</Text>
          </Button>
        )}
      </Header>
      <View
        type={"ScrollView"}
        style={{
          padding: 10
        }}
      >
        {meta.detailMode === "view" ? (
          fields.map(field => {
            return (
              <View
                key={field.name}
                style={{
                  marginBottom: 10
                }}
              >
                <Text>{field.label}</Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold"
                  }}
                >
                  {form.data[field.name]}
                </Text>
              </View>
            );
          })
        ) : (
          <FormJson
            data={form.data}
            field={filterField}
            style={{
              margin: 10
            }}
            onSubmit={data => {
              meta.filter = { ...data };
              meta.isShownFilter = false;
            }}
          >
            <Button
              type={"submit"}
              style={{
                backgroundColor: "#f3f4fb",
                borderColor: "#f1f1f1",
                borderStyle: "solid",
                borderBottomWidth: 1
              }}
            >
              <Text>Submit</Text>
            </Button>
          </FormJson>
        )}
      </View>
    </Modal>
  );
});
