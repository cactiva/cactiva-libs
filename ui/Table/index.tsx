import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import FlatList from "../FlatList";
import Text from "../Text";
import View from "../View";
import _ from "lodash";
import Icon from "../Icon";
import Button from "../Button";
import Spinner from "../Spinner";
import Input from "../Input";
import { fuzzyMatch } from "../../utils";
import Modal from "../Modal";
import FormJson, { FieldType, FormFieldProps } from "../FormJson";

export interface TableFieldProps extends FormFieldProps {
  name: string;
  order?: number;
  width?: number;
  height?: number;
  onPress?: () => void;
  component?: (item) => void;
}

export interface ConfigTableProps {
  primary: string;
  fields: TableFieldProps[];
}

export interface TableProps {
  data: any[];
  config: ConfigTableProps;
  style?: ViewStyle;
  loading?: boolean;
  onScrollEnd?: () => void;
  onFilter?: (filter) => void;
  onSearch?: (text) => void;
  onSelect?: (item) => void;
}

export default observer((props: TableProps) => {
  const {
    data,
    config,
    style,
    loading,
    onScrollEnd,
    onFilter,
    onSearch,
    onSelect
  } = props;
  const meta = useObservable({
    width: 0,
    tableWidth: 600,
    sort: null,
    sortField: null,
    loading: false,
    data: [],
    search: "",
    isShownFilter: false,
    filter: {}
  });
  const fields = config.fields;

  const filtering = () => {
    const filter = Object.keys(meta.filter);
    if (onFilter) {
      onFilter(meta.filter);
    } else if (filter.length > 0) {
      const ndata = [...meta.data];
      meta.data = ndata.filter((item: any) => {
        let res = true;
        for (let k in meta.filter) {
          if (
            !fuzzyMatch(meta.filter[k].toLowerCase(), item[k].toLowerCase())
          ) {
            res = false;
            break;
          }
        }
        return res;
      });
    }
  };

  const sorting = () => {
    const field = meta.sortField;
    if (field) {
      const ndata = [...meta.data];
      ndata.sort((a, b) => {
        let vA = a[field];
        let vB = b[field];
        if (!isNaN(parseFloat(vA)) && !isNaN(parseFloat(vB))) {
          vA = parseFloat(vA);
          vB = parseFloat(vB);
        } else {
          vA = vA.toLowerCase();
          vB = vB.toLowerCase();
        }
        if (vA < vB) {
          return -1;
        }
        if (vA > vB) {
          return 1;
        }
        return 0;
      });
      if (meta.sort === "desc") {
        ndata.reverse();
      }
      meta.data = ndata;
    }
  };

  useEffect(() => {
    meta.loading = loading;
  }, [loading]);

  useEffect(() => {
    meta.data = [...data];
    filtering();
    sorting();
  }, [data]);

  useEffect(() => {
    sorting();
  }, [meta.sort, meta.sortField]);

  useEffect(() => {
    filtering();
  }, [meta.filter]);
  const dataList = [...meta.data];

  return (
    <View
      style={{
        width: 600,
        ...style
      }}
      onLayout={ev => {
        const { width } = ev.nativeEvent.layout;
        const colLength = fields.length;
        meta.width = width / colLength;
        meta.tableWidth = width;
      }}
    >
      {meta.width > 0 && (
        <>
          <HeaderTable
            meta={meta}
            config={config}
            onSearch={onSearch}
          ></HeaderTable>

          {meta.width > 0 && dataList.length > 0 && (
            <FlatList
              stickyHeaderIndices={[0]}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#f3f4fb"
                    }}
                  >
                    {fields.map((field, index) => {
                      return (
                        <RenderHead
                          key={field.name}
                          field={field.name}
                          column={field}
                          meta={meta}
                        ></RenderHead>
                      );
                    })}
                  </View>
                );
              }}
              data={dataList.filter((item: any) => {
                if (meta.search.length > 0) {
                  let res = false;
                  for (let k in item) {
                    if (
                      fuzzyMatch(
                        meta.search.toLowerCase(),
                        item[k].toLowerCase()
                      )
                    ) {
                      res = true;
                      break;
                    }
                  }
                  return res;
                }
                return true;
              })}
              renderItem={({ item, index, separators }) => (
                <RenderRows
                  item={item}
                  config={config}
                  meta={meta}
                  rowType={index % 2 === 0 ? "odd" : "even"}
                  onSelect={onSelect}
                ></RenderRows>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderStyle: "solid",
                    borderColor: "#f7f7f7",
                    borderBottomWidth: 1
                  }}
                ></View>
              )}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      margin: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {meta.search ? (
                      <Text
                        style={{
                          fontSize: 16
                        }}
                      >
                        No matching records found
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16
                        }}
                      >
                        No item to display
                      </Text>
                    )}
                  </View>
                );
              }}
              keyExtractor={item => {
                if (item.header) return "header";
                return typeof item[config.primary] === "string"
                  ? item[config.primary]
                  : item[config.primary].toString();
              }}
              onEndReached={() => {
                if (!meta.search) onScrollEnd();
              }}
            ></FlatList>
          )}
          {meta.loading && (
            <Spinner size={"large"} style={{ flexGrow: 1, margin: 20 }} />
          )}
        </>
      )}
    </View>
  );
});

const HeaderTable = observer((props: any) => {
  const { meta, config, onSearch } = props;
  const fields = config.fields;
  const filter = meta.filter ? Object.keys(meta.filter) : [];

  return (
    <View
      style={{
        marginBottom: 10,
        marginTop: 10
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginBottom: 10
        }}
      >
        <Button
          style={{
            flexDirection: "row",
            backgroundColor: "#f3f4fb",
            borderColor: "#f7f7f7",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
            minWidth: 160,
            padding: 8
          }}
          onPress={() => (meta.isShownFilter = true)}
        >
          <Icon
            source={"AntDesign"}
            name={"filter"}
            size={18}
            color={"#828282"}
          />
          <Text
            style={{
              marginLeft: 5,
              color: "#828282"
            }}
          >
            Filter
          </Text>
        </Button>
        <Input
          onChangeText={text => {
            meta.search = text;
            onSearch && onSearch(meta.search);
          }}
          value={meta.search}
          type={"text"}
          placeholder={"Search..."}
          style={{
            backgroundColor: "#fafafc",
            borderColor: "#f7f7f7",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
            paddingLeft: 5,
            paddingRight: 5,
            flexGrow: 1,
            marginLeft: 10
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {filter.length > 0 &&
          filter.map(k => {
            const field = fields.find(f => f.name === k);
            return (
              <View
                key={k}
                style={{
                  borderRadius: 100,
                  borderStyle: "solid",
                  borderColor: "#f3f4fb",
                  borderWidth: 1,
                  backgroundColor: "#fafafc",
                  flexDirection: "row",
                  marginRight: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingBottom: 1
                  }}
                >
                  <Text>{field.label}:</Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginLeft: 4
                    }}
                  >
                    {meta.filter[k]}
                  </Text>
                </View>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    padding: 0
                  }}
                  onPress={() => {
                    const filter = meta.filter;
                    delete filter[k];
                    meta.filter = { ...filter };
                  }}
                >
                  <Icon source={"Ionicons"} name={"ios-close"} size={20} />
                </Button>
              </View>
            );
          })}
      </View>
      <Filter meta={meta} config={config}></Filter>
    </View>
  );
});

const Filter = observer((props: any) => {
  const { meta, config } = props;
  const fields = config.fields;
  const filterField = [];
  fields.map(field => {
    field.path = field.name;
    filterField.push(field);
  });

  return (
    <Modal
      visible={meta.isShownFilter}
      onRequestClose={() => (meta.isShownFilter = false)}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "trasnparent"
          }}
          onPress={() => (meta.isShownFilter = false)}
        ></Button>
        <View
          style={{
            backgroundColor: "#fff",
            minWidth: 500,
            minHeight: 400,
            borderRadius: 8,
            overflow: "hidden"
          }}
        >
          <Text
            style={{
              backgroundColor: "#fafafc",
              padding: 10,
              borderColor: "#f7f7f7",
              borderStyle: "solid",
              borderBottomWidth: 1
            }}
          >
            Filter
          </Text>
          <FormJson
            data={meta.filter}
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
        </View>
      </View>
    </Modal>
  );
});

const RenderRows = observer((props: any) => {
  const { config, item, meta, rowType, onSelect } = props;
  const fields = config.fields;
  const bgColor = rowType === "even" ? "#fff" : "#fafafc";

  return (
    <Button
      style={{
        flexDirection: "row",
        backgroundColor: bgColor,
        padding: 0
      }}
      onPress={() => {
        onSelect && onSelect(item);
      }}
    >
      {fields.map((field, index) => {
        return (
          <RenderColumn
            key={field.name}
            field={field.name}
            column={item}
            option={field}
            meta={meta}
          ></RenderColumn>
        );
      })}
    </Button>
  );
});

const RenderHead = observer((props: any) => {
  const { column, field, meta } = props;
  const customWidth = column.width;
  const width = column.width ? column.width : meta.width;
  const sortField = meta.sortField === field && meta.sort;

  return (
    <Button
      style={{
        padding: 8,
        flexGrow: customWidth ? 0 : 1,
        flexBasis: width,
        flexDirection: "row",
        borderRadius: 0,
        backgroundColor: "transparent",
        justifyContent: "flex-start"
      }}
      onPress={() => {
        meta.sort =
          meta.sortField === field && meta.sort === "asc" ? "desc" : "asc";
        meta.sortField = field;
      }}
    >
      {typeof column.label !== "string" ? (
        column.label
      ) : (
        <Text
          style={{
            fontSize: 12,
            color: "#9c9eaf",
            fontFamily: "SourceSansPro-Bold"
          }}
        >
          {column.label}
        </Text>
      )}
      <View
        style={{
          marginLeft: 5
        }}
      >
        <Icon
          source={"Ionicons"}
          name={"md-arrow-dropup"}
          color={sortField === "asc" ? "#44424b" : "#9c9eaf"}
          style={{
            height: 5,
            marginTop: -5
          }}
        />
        <Icon
          source={"Ionicons"}
          name={"md-arrow-dropdown"}
          color={sortField === "desc" ? "#44424b" : "#9c9eaf"}
          style={{
            height: 5
          }}
        />
      </View>
    </Button>
  );
});

const RenderColumn = observer((props: any) => {
  const { column, option, field, meta } = props;
  const customWidth = !!option.width;
  const width = customWidth ? option.width : meta.width;

  return (
    <View
      style={{
        padding: 5,
        paddingBottom: 8,
        paddingTop: 8,
        justifyContent: "center",
        flexGrow: customWidth ? 0 : 1,
        flexBasis: width
      }}
    >
      {!!option.component ? (
        option.component(column)
      ) : (
        <Text
          style={{
            color: "#3e3c46"
          }}
        >
          {column[field]}
        </Text>
      )}
    </View>
  );
});
