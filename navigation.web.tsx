import { createBrowserApp } from "@react-navigation/web";
import { createStackNavigator } from "react-navigation-stack";
import { useDimensions } from "react-native-hooks";
import React from "react";
import { initialRouteName } from "@src/components";

const theme = require("../theme.json");

export const AppContainer = () => {
  const App = createBrowserApp(
    createStackNavigator(routes(), {
      headerMode: "none",
      initialRouteName: initialRouteName
    })
  );

  return () => {
    if (theme.device === "mobile") {
      const dim = useDimensions().window;
      if (dim.width > 460)
        return <div className="mobile-root"><App /></div>
    }

    return <div className="web-root">
      <App />
    </div>;
  };
};

function importAllRoute(r, except) {
  const routes = {};
  r.keys().map(name => {
    const finalName = name.substr(2, name.length - 6);
    let skip = false;
    except.map(ex => {
      if (finalName.indexOf(ex) > -1) skip = true;
    });
    if (skip) return;
    routes[finalName] = {
      screen: r(name).default,
      path: finalName
    };
  });
  return routes;
}
export const routes = (except: string[] = ['libs', 'assets']) =>
  importAllRoute(require.context("../", true, /\.(tsx)$/), except);
