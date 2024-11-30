import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AuthProvider from '@contexts/AuthProvider';
import usePushNotification from '@hooks/usePushNotification';
import RootNavigator from '@navigators/RootNavigator';

const App: React.FC = () => {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({fade: true});
    }, 400);
  }, []);

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.error(error);
      }
    };

    listenToNotifications();
  }, [
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
    requestUserPermission,
  ]);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={styles.container}>
            <RootNavigator />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
