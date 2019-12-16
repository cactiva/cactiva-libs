import { toJS } from "mobx";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Text, View, ViewStyle, TouchableOpacity } from "react-native";
import FlatList from "../FlatList";
import TableHead, { IHeadProps } from "./TableHead";
import TableRow, { IRowProps } from "./TableRow";
import TableColumn, { IColumnProps } from "./TableColumn";
import _ from "lodash";
import Icon from "../Icon";

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
      title: e,
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
      meta.headerCells = _.castArray(_.get(children, "props.children", [])).map(e => {
        return {
          ...e, props: {
            style: {
              ...e.props.style,
              overflow: 'hidden'
            },
            ...e.props
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
        flexGrow: 1,
        borderStyle: "solid",
        borderColor: "#f7f7f7",
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
      {config.width > 0 ? (
        <FlatList
          data={data}
          stickyHeaderIndices={[0, data.length]}
          ListHeaderComponent={() => (
            <RenderHeader
              meta={meta}
              config={config}
              onSort={onSort}
            ></RenderHeader>
          )}
          renderItem={({ item, index, separators }) => {
            return (
              <RenderItem item={item} meta={meta} config={config}></RenderItem>
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
            if (!item[keyPath]) {
              try {
                const firstItem = item[Object.keys(item)[0]];
                if (firstItem) {
                  if (typeof firstItem !== "string") {
                    return firstItem.toString();
                  }
                  return firstItem;
                }
              } catch (e) {
                return index;
              }
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
    backgroundColor: "#f3f4fb",
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

const RenderHeaderCell = observer((props: any) => {
  const { component, config, onSort } = props;
  let onPress;
  if (config.mode === "manual") {
    if (onSort)
      onPress = () => {
        const cell = component.props;
        if (config.sortField === cell.path) {
          if (config.sortMode === 'asc') {
            config.sortMode = 'desc';
          } else if (config.sortMode === 'desc') {
            config.sortMode = '';
            config.sortField = '';
          } else {
            config.sortMode = 'asc';
          }
        } else {
          config.sortMode = "asc";
          config.sortField = cell.path;
        }
        onSort(config.sortField, config.sortMode);
      };
    const compProps = component.props;
    const children = compProps.children ? toJS(compProps.children) : undefined;
    const customWidth = compProps.width;
    const cellStyle = {
      padding: children ? 0 : 8,
      flexGrow: customWidth ? 0 : 1,
      flexBasis: _.get(compProps, "width", config.width),
      flexDirection: "row",
      borderRadius: 0,
      backgroundColor: "transparent",
      justifyContent: "flex-start",
      ..._.get(compProps, "style", {})
    };
    return (
      <TableColumn {...component.props} style={cellStyle}>
        <DefaultHeaderCell
          cell={compProps}
          onSort={onSort}
          config={config}
          onPress={onPress}
          compProps={compProps}
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
    return (
      <TouchableOpacity
        style={{
          flexGrow: 1,
          flexDirection: "row"
        }}
        onPress={onPress}
      >
        {cell.path === config.sortField &&
          <View
            style={{
              marginRight: 5,
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
        {compProps && compProps.children ? (
          React.cloneElement(compProps.children, {
            ...compProps.children.props,
            item: { title: compProps.title },
            path: "title"
          })
        ) : (
            <Text>{cell.title}</Text>
          )}
      </TouchableOpacity>
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
  const { meta, item, config } = props;
  const rowProps = toJS(_.get(meta, "rowProps", {}));
  const rowStyle = {
    flexDirection: "row",
    ..._.get(rowProps, "style", {})
  };
  let onPress;
  if (rowProps.onPress)
    onPress = () => {
      rowProps.onPress(toJS(item));
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
  if (config.mode === "manual") {
    const compProps = component.props;
    const customWidth = compProps.width;
    const cellStyle = {
      justifyContent: "center",
      flexGrow: customWidth ? 0 : 1,
      flexBasis: _.get(compProps, "width", config.width),
      ..._.get(compProps, "style", {})
    };
    if (compProps.children) {
      return <TableColumn style={cellStyle}>
        <TouchableOpacity onPress={compProps.onPress}>
          {typeof compProps.children === 'function' ? compProps.children(item[compProps.path], { ...compProps, item }) : compProps.children}
        </TouchableOpacity>
      </TableColumn>
    } else if (compProps.onPress) {
      return (
        <TableColumn {...compProps} style={cellStyle}>
          <TouchableOpacity onPress={compProps.onPress}>
            <Text>{item[compProps.path]}</Text>
          </TouchableOpacity>
        </TableColumn>
      );
    } else {
      const cellStyle = {
        padding: 8,
        justifyContent: "center",
        flexGrow: 1,
        flexBasis: config.width
      } as ViewStyle;
      return (
        <TableColumn style={cellStyle}>
          <Text>{item[compProps.path]}</Text>
        </TableColumn>
      );
    }
  }
});
