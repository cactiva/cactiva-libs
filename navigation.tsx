import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

export const AppContainer = () => {
  return createAppContainer(
    createStackNavigator(
      {},
      {
        headerMode: "none"
      }
    )
  );
};
