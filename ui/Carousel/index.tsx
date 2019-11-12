import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import Carousel, {
  CarouselProps as CarouselPropsOrigin
} from "react-native-snap-carousel";
import View from "../View";
import { useDimensions } from "react-native-hooks";

export interface CarouselProps extends CarouselPropsOrigin<any> {
  style?: any;
}

export default observer((props: CarouselProps) => {
  const { style } = props;
  const carouselProps: any = { ...props };
  delete carouselProps.style;
  const ref = useRef(null);
  const dim = useDimensions().window;

  return (
    <View style={style}>
      <Carousel
        ref={ref}
        itemWidth={dim.width - 50}
        sliderWidth={dim.width}
        layout={"stack"}
        // layoutCardOffset={18}
        containerCustomStyle={{
          overflow: "visible"
        }}
        contentContainerCustomStyle={{
          paddingLeft: 10,
          paddingRight: 10
        }}
        {...carouselProps}
      />
    </View>
  );
});
