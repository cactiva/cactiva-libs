import { observer, useObservable } from "mobx-react-lite";
import React, { useRef } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import View from "../View";
import { useDimensions } from "react-native-hooks";
import _ from "lodash";

export interface CarouselProps extends Carousel.propTypes {
  data: any[];
  renderItem: any;
  itemWidth: number;
  sliderWidth: number;
  children?: any;
  style?: any;
  loop?: boolean;
  isPagination?: boolean;
  paginationProps?: Pagination.propTypes;
}

export default observer((props: CarouselProps) => {
  const { style, data, isPagination } = props;
  const carouselProps: any = { ...props };
  delete carouselProps.style;
  const ref = useRef(null);
  const dim = useDimensions().window;
  const meta = useObservable({
    activeSlide: 0,
    dataLength: data.length
  });

  return (
    <View style={style}>
      <Carousel
        ref={ref}
        itemWidth={dim.width - 50}
        sliderWidth={dim.width}
        layout={"default"}
        layoutCardOffset={18}
        containerCustomStyle={{
          overflow: "visible"
        }}
        {...carouselProps}
        onSnapToItem={index => {
          meta.activeSlide = index;
          carouselProps.onSnapToItem && carouselProps.onSnapToItem(index);
        }}
      />
      {!!isPagination && (
        <Pagination
          dotsLength={meta.dataLength}
          activeDotIndex={meta.activeSlide}
          containerStyle={{
            paddingHorizontal: 5,
            paddingVertical: 5
          }}
          dotStyle={{
            borderRadius: 5,
            backgroundColor: "rgba(0, 0, 0, 0.75)"
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          {..._.get(props, "paginationProps", {})}
        />
      )}
    </View>
  );
});
