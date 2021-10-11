import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import HomeScreen from "./src/HomeScreen";
import DetailScreen from "./src/DetailScreen";
import styles from "./App.component.style";
import store from "./src/redux/store";

const Stack = createNativeStackNavigator();
const HEADER_SHOWN = false;

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer style={styles.navigationContainer}>
            <Stack.Navigator>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: HEADER_SHOWN }}
              />

              <Stack.Screen
                name="DetailScreen"
                component={DetailScreen}
                options={{ headerShown: HEADER_SHOWN }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
