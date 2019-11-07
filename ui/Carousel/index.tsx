import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import Carousel, {
  CarouselProps as CarouselPropsOrigin
} from "react-native-snap-carousel";
import View from "../View";

export interface CarouselProps extends CarouselPropsOrigin<any> {
  style?: any;
}

export default observer((props: CarouselProps) => {
  const { style } = props;
  const carouselProps: any = { ...props };
  delete carouselProps.style;
  const ref = useRef(null);
  return (
    <View style={style}>
      <Carousel ref={ref} {...carouselProps} />
    </View>
  );
});
