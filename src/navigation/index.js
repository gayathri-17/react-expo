import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import ProfileScreen from "../screens/profile";
import ImageViewer from "../screens/imageViewer"
import { View, Text } from 'react-native'
import NavKeys from '../constants/navKeys'
import DefaultStrings from '../constants/defaultStrings'


const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={NavKeys.PROFILE}>
        <Stack.Screen
          name={NavKeys.PROFILE}
          component={ProfileScreen}
          options={{
            headerStyle: {
              backgroundColor: '#7049f6',
            },
            headerCenter: () => (<View style={{ textAlign: 'center' }}><Text style={{
              color: '#fff',
              fontSize: 20
            }}>{DefaultStrings.CREATE_PROFILE}</Text></View>)
          }}
        />
        <Stack.Screen
          name={NavKeys.IMAGE_VIEWER}
          component={ImageViewer}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
