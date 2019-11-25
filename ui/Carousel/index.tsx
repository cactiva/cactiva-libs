import { DefaultTheme } from "@src/libs/theme";
import Theme from "@src/theme.json";
import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { useDimensions } from "react-native-hooks";
import Carousel, {
  Pagination as PaginationOrigin
} from "react-native-snap-carousel";
import View from "../View";

export interface CarouselProps {
  data: any[];
  renderItem: any;
  itemWidth: number;
  sliderWidth: number;
  children?: any;
  style?: any;
  loop?: boolean;
  onSnapToItem?: any;
  enableMomentum?: boolean;
  enableSnap?: boolean;
  firstItem?: number;
  inactiveSlideOpacity?: number;
  inactiveSlideScale?: number;
  slideStyle?: any;
}

export default observer((props: CarouselProps) => {
  const { style, data, children } = props;
  const carouselProps: any = { ...props };
  delete carouselProps.style;
  delete carouselProps.data;
  const ref = useRef(null);
  const dim = useDimensions().window;
  const meta = useObservable({
    activeSlide: 0,
    dataLength: 0,
    data: []
  });

  useEffect(() => {
    if (data && data.length > 0) {
      meta.data = data;
      meta.dataLength = data.length;
    }
  }, [data]);

  const childrenWithProps = React.Children.map(children, child => {
    let cprops = {
      dotsLength: meta.dataLength,
      activeDotIndex: meta.activeSlide
    };
    return renderChild(child, cprops);
  });

  return (
    <View style={style}>
      <Carousel
        data={meta.data}
        ref={ref}
        itemWidth={dim.width - 50}
        sliderWidth={dim.width}
        layout={"default"}
        containerCustomStyle={{
          overflow: "visible"
        }}
        {...carouselProps}
        onSnapToItem={index => {
          meta.activeSlide = index;
          carouselProps.onSnapToItem && carouselProps.onSnapToItem(index);
        }}
      />
      {childrenWithProps}
    </View>
  );
});

export const Pagination = observer((props: any) => {
  const theme = {
    ...DefaultTheme,
    ...Theme.colors
  };
  return (
    <PaginationOrigin
      dotsLength={0}
      activeDotIndex={0}
      containerStyle={{
        paddingHorizontal: 0,
        paddingVertical: 0
      }}
      dotStyle={{
        height: 8,
        width: 8,
        borderRadius: 20,
        backgroundColor: theme.primary
      }}
      dotContainerStyle={{
        marginLeft: 3,
        marginRight: 3
      }}
      inactiveDotOpacity={0.3}
      inactiveDotScale={1}
      {...props}
    />
  );
});

const renderChild = (child: any, props: any) => {
  if (child.type === Pagination) {
    let cprops = {};
    if (child.type === Pagination) {
      cprops = props;
    }
    return React.cloneElement(child, {
      ...child.props,
      ...cprops
    });
  } else {
    const childrenRaw = _.get(child, "props.children");
    const hasChildren = !!childrenRaw;
    if (!hasChildren) {
      return child;
    } else {
      const children = Array.isArray(childrenRaw) ? childrenRaw : [childrenRaw];
      return React.cloneElement(child, {
        ...props,
        children: React.Children.map(children, el => renderChild(el, props))
      });
    }
  }
};
