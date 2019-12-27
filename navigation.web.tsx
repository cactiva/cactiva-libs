import { createBrowserApp } from "@react-navigation/web";
import { createStackNavigator } from "react-navigation-stack";
import { useDimensions } from "react-native-hooks";
import React from "react";
import components, { initialRouteName } from "@src/components";
import { Animated, Easing } from "react-native";

const theme = require("../theme.json");

export const AppContainer = () => {

  const componentRoutes = {};
  Object.keys(components).forEach((key: string) => {
    // if (key.indexOf('/') < 0) {
      componentRoutes[key] = {
        screen: components[key],
        params: {},
        path: key
      }
    // }
  })

  const App = createBrowserApp(
    createStackNavigator(componentRoutes, {
      headerMode: "none",
      initialRouteName: initialRouteName,
      transitionConfig: () => ({
        transitionSpec: {
          duration: 0,
          timing: Animated.timing,
          easing: Easing.out(Easing.poly(4))
        },
        screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps;
          const { index } = scene;
          const width = layout.initWidth;
          const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, 0]
          });
          if (index <= 1) {
            return {};
          }

          return { transform: [{ translateX }] };
        }
      })
    })
  );

  return () => {
    if (theme.device === "mobile") {
      const dim = useDimensions().window;
      if (dim.width > 460)
        return (
          <div className="mobile-root">
            <App />
          </div>
        );
    }

    return (
      <div className="web-root">
        <App />
      </div>
    );
  };
};

// function importAllRoute(r, except) {
//   const routes = {};
//   r.keys().map(name => {
//     const finalName = name.substr(2, name.length - 6);
//     let skip = false;
//     except.map(ex => {
//       if (finalName.indexOf(ex) > -1) skip = true;
//     });
//     if (skip) return;
//     routes[finalName] = {
//       screen: r(name).default,
//       path: finalName
//     };
//   });
//   return routes;
// }
// export const routes = (except: string[] = ["libs", "assets"]) =>
//   importAllRoute(require.context("../", true, /\.(tsx)$/), except);
