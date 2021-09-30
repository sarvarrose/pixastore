import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/HomeScreen";
import DetailScreen from "./src/DetailScreen";

const Stack = createNativeStackNavigator();
const HEADER_SHOWN = false;

const App = () => {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  navigationContainer: { paddingTop: StatusBar.currentHeight },
});

export default App;
