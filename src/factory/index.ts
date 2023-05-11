import * as ImageResizer from '@bam.tech/react-native-image-resizer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
// import RNFBMessaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import Video from 'react-native-video';

import {
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  // createNativeNotificationService,
} from '@sendbird/uikit-react-native';
import { SendbirdChatSDK } from '@sendbird/uikit-utils';

let AppSendbirdSDK: SendbirdChatSDK;
export const GetSendbirdSDK = () => AppSendbirdSDK;
export const SetSendbirdSDK = (sdk: SendbirdChatSDK) => (AppSendbirdSDK = sdk);

export const RootStack = createNativeStackNavigator();
export const ClipboardService = createNativeClipboardService(Clipboard);
export const NotificationService = {} as any;
// createNativeNotificationService({
//   messagingModule: RNFBMessaging,
//   permissionModule: Permissions,
// });
export const FileService = createNativeFileService({
  imagePickerModule: ImagePicker,
  documentPickerModule: DocumentPicker,
  permissionModule: Permissions,
  fsModule: FileAccess,
  mediaLibraryModule: CameraRoll,
});
export const MediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
});

export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  return Platform.select({ ios: state, android: state });
};
