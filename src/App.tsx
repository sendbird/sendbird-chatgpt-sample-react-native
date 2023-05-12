import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { SendbirdUIKitContainer, useSendbirdChat } from '@sendbird/uikit-react-native';
import { createTheme, DarkUIKitTheme, LightUIKitTheme, Palette } from '@sendbird/uikit-react-native-foundation';

import {
  ClipboardService,
  FileService,
  GetTranslucent,
  MediaService,
  NotificationService,
  RootStack,
  SetSendbirdSDK,
} from './factory';
import useAppearance from './hooks/useAppearance';
import { navigationActions, navigationRef, Routes } from './libs/navigation';
import {
  ErrorInfoScreen,
  GroupChannelBannedUsersScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelModerationScreen,
  GroupChannelMutedMembersScreen,
  GroupChannelNotificationsScreen,
  GroupChannelOperatorsScreen,
  GroupChannelRegisterOperatorScreen,
  GroupChannelScreen,
  GroupChannelSettingsScreen,
  GroupChannelTabs,
  MessageSearchScreen,
  SignInScreen,
} from './screens';
import FileViewerScreen from './screens/uikit/FileViewerScreen';
import { LogBox } from 'react-native';
import { APP_ID } from './configurations';

LogBox.ignoreLogs(['UIKit Warning:']);

const darkTheme = createTheme({
  colorScheme: 'dark',
  palette: { ...Palette, information: '#A9BBFA' },
  colors: () => DarkUIKitTheme.colors,
});

const lightTheme = createTheme({
  colorScheme: 'light',
  palette: { ...Palette, information: '#A9BBFA' },
  colors: () => LightUIKitTheme.colors,
});

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      chatOptions={{
        localCacheStorage: AsyncStorage,
        onInitialized: SetSendbirdSDK,
        enableChannelListTypingIndicator: true,
        enableChannelListMessageReceiptStatus: true,
        enableAutoPushTokenRegistration: false,
      }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
      styles={{
        defaultHeaderTitleAlign: 'left',
        theme: isLightTheme ? lightTheme : darkTheme,
        statusBarTranslucent: GetTranslucent(),
      }}
      errorBoundary={{ ErrorInfoComponent: ErrorInfoScreen }}
      userProfile={{
        onCreateChannel: (channel) => {
          const params = { channelUrl: channel.url };

          if (channel.isGroupChannel()) {
            navigationActions.push(Routes.GroupChannel, params);
          }

          if (channel.isOpenChannel()) {
            navigationActions.push(Routes.OpenChannel, params);
          }
        },
      }}
    >
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const Navigations = () => {
  const { currentUser } = useSendbirdChat();
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  // useEffect(() => {
  //   const unsubscribes = [onForegroundAndroid(), onForegroundIOS()];
  //   return () => {
  //     unsubscribes.forEach((fn) => fn());
  //   };
  // }, []);

  // useEffect(() => {
  //   const { remove } = AppState.addEventListener('change', async () => {
  //     const count = await sdk.groupChannel.getTotalUnreadMessageCount();
  //     Notifee.setBadgeCount(count);
  //   });
  //   return () => remove();
  // }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={isLightTheme ? DefaultTheme : DarkTheme}>
      {/*<LogView />*/}
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <RootStack.Screen name={Routes.SignIn} component={SignInScreen} />
        ) : (
          <>
            {/** Group channels **/}
            <RootStack.Group>
              <RootStack.Screen name={Routes.GroupChannelTabs} component={GroupChannelTabs} />
              <RootStack.Screen name={Routes.GroupChannel} component={GroupChannelScreen} />
              <RootStack.Group>
                <RootStack.Screen name={Routes.GroupChannelSettings} component={GroupChannelSettingsScreen} />
                <RootStack.Screen name={Routes.GroupChannelNotifications} component={GroupChannelNotificationsScreen} />
                <RootStack.Screen name={Routes.GroupChannelMembers} component={GroupChannelMembersScreen} />
                <RootStack.Screen name={Routes.GroupChannelModeration} component={GroupChannelModerationScreen} />
                <RootStack.Screen name={Routes.GroupChannelMutedMembers} component={GroupChannelMutedMembersScreen} />
                <RootStack.Screen name={Routes.GroupChannelBannedUsers} component={GroupChannelBannedUsersScreen} />
                <RootStack.Screen name={Routes.GroupChannelOperators} component={GroupChannelOperatorsScreen} />
                <RootStack.Screen
                  name={Routes.GroupChannelRegisterOperator}
                  component={GroupChannelRegisterOperatorScreen}
                />
              </RootStack.Group>
              <RootStack.Screen name={Routes.GroupChannelCreate} component={GroupChannelCreateScreen} />
              <RootStack.Screen name={Routes.GroupChannelInvite} component={GroupChannelInviteScreen} />
              <RootStack.Screen name={Routes.MessageSearch} component={MessageSearchScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}>
              <RootStack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default App;
