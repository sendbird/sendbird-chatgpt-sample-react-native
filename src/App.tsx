import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { SendbirdUIKitContainer, useSendbirdChat } from '@sendbird/uikit-react-native';
import { createTheme, DarkUIKitTheme, LightUIKitTheme, Palette } from '@sendbird/uikit-react-native-foundation';

// import LogView from './components/LogView';
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
// import { onForegroundAndroid, onForegroundIOS } from './libs/notification';

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
  HomeScreen,
  MessageSearchScreen,
  OpenChannelBannedUsersScreen,
  OpenChannelCreateScreen,
  OpenChannelLiveStreamScreen,
  OpenChannelModerationScreen,
  OpenChannelMutedParticipantsScreen,
  OpenChannelOperatorsScreen,
  OpenChannelParticipantsScreen,
  OpenChannelRegisterOperatorScreen,
  OpenChannelScreen,
  OpenChannelSettingsScreen,
  OpenChannelTabs,
  PaletteScreen,
  SignInScreen,
  ThemeColorsScreen,
} from './screens';
import FileViewerScreen from './screens/uikit/FileViewerScreen';
import { LogBox } from 'react-native';

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
      appId={'BDD627AC-AC88-45F4-B277-2B3B5C4610E3'}
      chatOptions={{
        localCacheStorage: AsyncStorage,
        onInitialized: SetSendbirdSDK,
        enableAutoPushTokenRegistration: false,
        enableChannelListTypingIndicator: true,
        enableChannelListMessageReceiptStatus: true,
        enableUserMention: true,
        enableMessageSearch: true,
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
            <RootStack.Screen name={Routes.Home} component={HomeScreen} />

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

            {/** Open channels **/}
            <RootStack.Group>
              <RootStack.Screen name={Routes.OpenChannelTabs} component={OpenChannelTabs} />
              <RootStack.Screen name={Routes.OpenChannel} component={OpenChannelScreen} />
              <RootStack.Screen name={Routes.OpenChannelLiveStream} component={OpenChannelLiveStreamScreen} />
              <RootStack.Group>
                <RootStack.Screen name={Routes.OpenChannelSettings} component={OpenChannelSettingsScreen} />
                <RootStack.Screen name={Routes.OpenChannelParticipants} component={OpenChannelParticipantsScreen} />
                <RootStack.Screen name={Routes.OpenChannelModeration} component={OpenChannelModerationScreen} />
                <RootStack.Screen
                  name={Routes.OpenChannelMutedParticipants}
                  component={OpenChannelMutedParticipantsScreen}
                />
                <RootStack.Screen name={Routes.OpenChannelBannedUsers} component={OpenChannelBannedUsersScreen} />
                <RootStack.Screen name={Routes.OpenChannelOperators} component={OpenChannelOperatorsScreen} />
                <RootStack.Screen
                  name={Routes.OpenChannelRegisterOperator}
                  component={OpenChannelRegisterOperatorScreen}
                />
              </RootStack.Group>
              <RootStack.Screen name={Routes.OpenChannelCreate} component={OpenChannelCreateScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}>
              <RootStack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ headerShown: true }}>
              <RootStack.Screen name={Routes.ThemeColors} component={ThemeColorsScreen} />
              <RootStack.Screen name={Routes.Palette} component={PaletteScreen} />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default App;
