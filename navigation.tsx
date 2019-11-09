import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import components from "@src/components";

export const AppContainer = () => {
  return createAppContainer(
    createStackNavigator(components, {
      headerMode: "none"
    })
  );
};
