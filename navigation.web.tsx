import React, { useEffect, useMemo, useState } from "react";
import { useDimensions } from "react-native-hooks";
import { router } from "react-navigation-hooks";

const theme = require("../theme.json");


const pages = {
  components: {},
  routes: {},
  initial: ''
}
const Container = () => {
  const [ready, setReady] = useState(false);
  const routeResult = router.useRoutes(pages.routes);
  let App = () => {
    if (!ready) {
      return <div></div>
    }
    return routeResult || <div>Not Found</div>;
  };
  useEffect(() => {
    import("@src/components").then(res => {
      pages.components = res.default;
      pages.initial = res.initialRouteName;
      pages.routes = {};

      for (let i in pages.components) {
        const Component = pages.components[i];
        pages.routes["/" + i] = (navigation) => <Component navigation={navigation} />;
      }

      const Component = pages.components[pages.initial];
      pages.routes["/"] = (navigation) => <Component navigation={navigation} />;
      setReady(true);
    })
  })

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
}


export const AppContainer = () => {
  return () => <Container />;
};
