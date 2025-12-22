import { ActionSheetIOS, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { PlayerDashboardScreen } from './screens/PlayerDashboardScreen';
import { CaptainDashboardScreen } from './screens/CaptainDashboardScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { NoticesListScreen } from './screens/NoticesListScreen';
import { RootStackParamList } from './types';
import { StatusBar } from 'expo-status-bar';

import { UserProvider } from './context/UserContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#fff' }
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="PlayerDashboard" component={PlayerDashboardScreen} />
            <Stack.Screen name="CaptainDashboard" component={CaptainDashboardScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="NoticesList" component={NoticesListScreen} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
