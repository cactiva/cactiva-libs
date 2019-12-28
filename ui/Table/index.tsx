import _ from "lodash";
import { toJS } from "mobx";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import FlatList from "../FlatList";
import Icon from "../Icon";
import TableColumn from "./TableColumn";
import TableHead, { IHeadProps } from "./TableHead";
import TableRow, { IRowProps } from "./TableRow";
import { DefaultTheme } from "@src/libs/theme";

import Theme from "@src/theme.json";
import { uuid } from "@src/libs/utils";
import EmptyCell from "./EmptyCell";
const theme = {
  ...DefaultTheme,
  ...Theme.colors
};
interface IColumn {
  title: string;
  path: string;
  width?: number;
  onPress?: (item, path) => void;
}

interface IRows {
  style?: ViewStyle;
  onPress?: (item) => void;
}

interface IMeta {
  cells: any[];
  headerProps: IHeadProps;
  rowProps: IRowProps;
  headerCells: any[];
  custom: any;
}

export interface ITableProps {
  data?: any[];
  columnMode?: "auto" | "manual";
  keyPath?: string;
  style?: ViewStyle;
  children?: any;
  config?: any;
  onEndReached?: () => void;
  onSort?: (path, sort) => void;
}

export default observer((props: ITableProps) => {
  let {
    data,
    columnMode,
    keyPath,
    style,
    children,
    onEndReached,
    onSort,
  } = props;
  const propsConfig = props.config;

  if (!keyPath) keyPath = 'id';
  if (!data) data = [];
  if (!columnMode) columnMode = 'auto';

  const generateColumns = () => {
    return Object.keys(data[0]).map(e => ({
      title: _.startCase(e),
      path: e
    }));
  };
  const meta: IMeta = useObservable({
    headerProps: {} as IHeadProps,
    rowProps: {} as IRowProps,
    headerCells: [] as any[],
    cells: [] as any[],
    custom: [] as any
  });
  const config = useObservable({
    mode: "manual",
    width: 0,
    tableWidth: 0,
    sortField: "",
    sortMode: "asc",
    ...propsConfig,
  });
  const length = data && data.length;
  const watchChild = children => {
    if (children.type === TableHead) {
      let props = { ...children.props };
      if (children) delete props.children;
      meta.headerProps = props;
      meta.headerCells = _.castArray(_.get(children, "props.children", [])).map((e) => {
        return {
          ...e, props: {
            style: {
              ...e.props.style,
              overflow: 'hidden'
            },
            ...e.props,
          }
        }
      });
    } else if (children.type === TableRow) {
      let props = { ...children.props };
      if (children) delete props.children;
      meta.rowProps = props;
      meta.cells = _.get(children, "props.children", []);
    } else if (children.type === TableColumn) {
      meta.cells.push(children);
    }
  };

  useEffect(() => {
    if (meta.cells.length > 0) meta.cells = [];
    if (!columnMode || columnMode === "auto" || !children) {
      meta.cells = ((length > 0
        ? generateColumns()
        : []) as unknown) as IColumn[];
      config.mode = "auto";
    } else {
      if (Array.isArray(children)) {
        (children || []).map((child: any) => {
          watchChild(child);
        });
      } else {
        watchChild(children);
      }
    }
  }, [data, length]);

  return (
    <View
      style={{
        borderStyle: "solid",
        borderColor: "#f7f7f7",
        minHeight: 150,
        position: 'relative',
        borderWidth: 1,
        ...style
      }}
      onLayout={ev => {
        const { width } = ev.nativeEvent.layout;
        const colLength = meta.cells.length;
        config.width = width / colLength;
        config.tableWidth = width;
      }}
    >
      {config.width > 0 ? (<View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <FlatList
          style={{ flex: 1 }}
          data={data}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <RenderHeader
              meta={meta}
              config={config}
              onSort={onSort}
            ></RenderHeader>
          )}
          renderItem={({ item, index, separators }) => {
            return (
              <RenderItem item={item} rowNumber={index} meta={meta} config={config}></RenderItem>
            );
          }}
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
                <Text
                  style={{
                    fontSize: 16
                  }}
                >
                  No item to display
                  </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => {
            if (!!item && !item[keyPath]) {
              try {
                const firstItem = item[Object.keys(item)[0]];
                if (firstItem) {
                  if (typeof firstItem !== "string") {
                    return JSON.stringify(firstItem);
                  }
                  return firstItem;
                }
              } catch (e) {
                return index;
              }
            } else {
              return uuid();
            }

            if (typeof item[keyPath] !== 'string') {
              return item[keyPath].toString();
            }
            return item[keyPath];
          }}
          onEndReached={() => {
            if (onEndReached) onEndReached();
          }}
        ></FlatList>
      </View>
      ) : (
          <View />
        )}
    </View>
  );
});

const RenderHeader = observer((props: any) => {
  const { meta, config, onSort } = props;
  const headerStyle = {
    flexDirection: "row",
    backgroundColor: theme.light,
    ..._.get(meta, "headerProps.style", {})
  };
  return (
    <TableHead {..._.get(meta, "headerProps", {})} style={headerStyle}>
      {meta.headerCells.length > 0
        ? meta.headerCells.map((child, key: number) => {
          return (
            <RenderHeaderCell
              key={key}
              component={child}
              config={config}
              onSort={onSort}
            ></RenderHeaderCell>
          );
        })
        : meta.cells.map((child, key: number) => {
          return (
            <RenderHeaderCell
              key={key}
              component={child}
              config={config}
              onSort={onSort}
            ></RenderHeaderCell>
          );
        })}
    </TableHead>
  );
});

const baseCellStyle = {
  padding: 8,
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  flex: 1,
  // flexBasis: _.get(compProps, "width", config.width)
  // flexGrow: 0,
  // flexBasis: _.get(compProps, "width", config.width),
}
const RenderHeaderCell = observer((props: any) => {
  const { component, config, onSort } = props;
  let onPress;
  if (config.mode === "manual") {
    if (onSort)
      onPress = () => {
        const cell = component.props;
        let sortMode = config.sortMode + '';
        let sortField = config.sortField + '';
        if (sortField === cell.path) {
          if (sortMode === 'asc') {
            sortMode = 'desc';
          } else if (sortMode === 'desc') {
            sortMode = '';
          } else {
            sortMode = 'asc';
          }
        } else {
          sortMode = "asc";
          sortField = cell.path;
        }

        if (onSort(sortField, sortMode)) {
          config.sortField = sortField;
          config.sortMode = sortMode;
        }
      };
    const compProps = component.props;
    const children = compProps.children ? toJS(compProps.children) : undefined;
    const cellStyle = {
      ...baseCellStyle,
      ..._.get(compProps, "style", {})
    };
    return (
      <TableColumn {...component.props} style={cellStyle}>
        <DefaultHeaderCell
          cell={compProps}
          onSort={onSort}
          config={config}
          onPress={onPress}
          compProps={{ ...compProps, children }}
        ></DefaultHeaderCell>
      </TableColumn>
    );
  } else {
    const cell = component;
    if (onSort)
      onPress = () => {
        if (config.sortField === cell.path) {
          config.sortMode = config.sortMode === "asc" ? "desc" : "asc";
        } else {
          config.sortMode = "asc";
          config.sortField = cell.path;
        }
        onSort(config.sortField, config.sortMode);
      };
    const cellStyle = {
      padding: 8,
      flexGrow: 1,
      flexBasis: config.width,
      flexDirection: "row",
      borderRadius: 0,
      backgroundColor: "transparent",
      justifyContent: "flex-start"
    };
    return (
      <TableColumn {...component.props} style={cellStyle}>
        <DefaultHeaderCell
          cell={cell}
          onSort={onSort}
          config={config}
          onPress={onPress}
        ></DefaultHeaderCell>
      </TableColumn>
    );
  }
});

const DefaultHeaderCell = observer((props: any) => {
  const { cell, onSort, config, onPress, compProps } = props;

  if (onSort) {
    let children = <Text>{cell.title}</Text>
    if (compProps && compProps.children) {
      children = compProps.children;
    }
    return (
      <TouchableOpacity
        style={{
          flexGrow: 1,
          flexDirection: "row"
        }}
        onPress={onPress}
      >
        {cell.path === config.sortField && config.sortMode !== '' &&
          < View
            style={{
              marginRight: 5,
              marginTop: 3,
              justifyContent: "center"
            }}
          >
            <Icon
              source={"Ionicons"}
              name={"md-arrow-dropup"}
              color={
                config.sortField === cell.path && config.sortMode === "asc"
                  ? "#44424b"
                  : "#9c9eaf"
              }
              style={{
                height: 5,
                marginTop: -8
              }}
            />
            <Icon
              source={"Ionicons"}
              name={"md-arrow-dropdown"}
              color={
                config.sortField === cell.path && config.sortMode === "desc"
                  ? "#44424b"
                  : "#9c9eaf"
              }
              style={{
                height: 5
              }}
            />
          </View>
        }
        {children}
      </TouchableOpacity >
    );
  }
  return (
    <>
      {compProps && compProps.children ? (
        React.cloneElement(compProps.children, {
          ...compProps.children.props,
          item: { title: compProps.title },
          path: "title"
        })
      ) : (
          <Text>{cell.title}</Text>
        )}
    </>
  );
});

const RenderItem = observer((props: any) => {
  const { meta, item, rowNumber, config } = props;
  const rowProps = toJS(_.get(meta, "rowProps", {}));
  const rowStyle = {
    flexDirection: "row",
    ..._.get(rowProps, "style", {})
  };
  let onPress;
  if (rowProps.onPress)
    onPress = () => {
      rowProps.onPress(toJS(item), rowNumber);
    };

  return (
    <TableRow {...rowProps} onPress={onPress} style={rowStyle}>
      {meta.rows
        ? meta.rows.map((child, key: number) => {
          return (
            <RenderCell
              key={key}
              item={item}
              component={child}
              config={config}
            ></RenderCell>
          );
        })
        : meta.cells.map((child, key: number) => {
          return (
            <RenderCell
              key={key}
              item={item}
              component={child}
              config={config}
            ></RenderCell>
          );
        })}
    </TableRow>
  );
});
const RenderCell = observer((props: any) => {
  const { item, component, config } = props;

  let rawValue = config.mode === "manual" ? _.get(item, component.props.path) : item[component.path];
  let value = typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
  const valueEl = value === 'null' ? <EmptyCell /> : <Text>{value}</Text>;

  if (config.mode === "manual") {
    const compProps = component.props;
    const cellStyle = {
      ...baseCellStyle,
      ..._.get(compProps, "style", {})
    };
    if (compProps.children) {
      const child = typeof compProps.children === 'function' ?
        compProps.children(rawValue, { ...compProps, item }) :
        compProps.children;
      return <TableColumn style={cellStyle}>
        {compProps.onPress ? <TouchableOpacity onPress={compProps.onPress}>
          {child}
        </TouchableOpacity> : child}
      </TableColumn>
    } else if (compProps.onPress) {
      return (
        <TableColumn {...compProps} style={cellStyle}>
          <TouchableOpacity onPress={compProps.onPress}>
            {valueEl}
          </TouchableOpacity>
        </TableColumn>
      );
    } else {
      const cellStyle = {
        ...baseCellStyle,
      } as ViewStyle;
      return (
        <TableColumn style={cellStyle}>
          {valueEl}
        </TableColumn>
      );
    }
  } else {
    const cellStyle = {
      padding: 8,
      justifyContent: "center",
      flexGrow: 1,
      flexBasis: config.width
    } as ViewStyle;
    return <TableColumn style={cellStyle}>{valueEl}</TableColumn>
  }
});
