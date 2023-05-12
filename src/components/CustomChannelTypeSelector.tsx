import React, { useContext } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';

import {
  createStyleSheet,
  Icon,
  Modal,
  Text,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { GroupChannelListContexts, useSendbirdChat } from '@sendbird/uikit-react-native';
import { Routes } from '../libs/navigation';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { Bot, Bots } from '../configurations';

const STATUS_BAR_TOP_INSET_AS: 'margin' | 'padding' = Platform.select({ android: 'margin', default: 'padding' });

const CustomChannelTypeSelector = () => {
  const { statusBarTranslucent, HeaderComponent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const typeSelector = useContext(GroupChannelListContexts.TypeSelector);
  const { visible, hide } = typeSelector;

  const { sdk, currentUser } = useSendbirdChat();
  const { navigation } = useAppNavigation();

  const onPressBotType = async (bot: Bot) => {
    hide();

    const channel = await sdk.groupChannel.createChannel({
      name: '',
      coverUrl: '',
      isDistinct: false,
      invitedUserIds: [bot.id, currentUser!.userId],
      operatorUserIds: [currentUser!.userId],
    });

    navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url });
  };

  return (
    <Modal visible={visible} onClose={hide} statusBarTranslucent={statusBarTranslucent}>
      <HeaderComponent
        title={'Channel type'}
        right={<Icon icon={'close'} color={colors.onBackground01} />}
        onPressRight={typeSelector.hide}
        statusBarTopInsetAs={STATUS_BAR_TOP_INSET_AS}
      >
        <View style={styles.buttonArea}>
          {Object.values(Bots).map((bot) => {
            return (
              <TouchableOpacity
                key={bot.id}
                activeOpacity={0.6}
                onPress={() => onPressBotType(bot)}
                style={styles.typeButton}
              >
                <DefaultTypeIcon bot={bot} />
                <DefaultTypeText bot={bot} />
              </TouchableOpacity>
            );
          })}
        </View>
      </HeaderComponent>
    </Modal>
  );
};

const DefaultTypeIcon = ({ bot }: { bot: Bot }) => {
  const { colors } = useUIKitTheme();
  const imageSource = bot.icon;

  return <Image source={imageSource} resizeMode={'contain'} style={[styles.icon, { tintColor: colors.primary }]} />;
};

const DefaultTypeText = ({ bot }: { bot: Bot }) => {
  const { colors } = useUIKitTheme();
  return (
    <Text caption2 color={colors.onBackground01}>
      {bot.name}
    </Text>
  );
};

const styles = createStyleSheet({
  buttonArea: {
    flexDirection: 'row',
  },
  typeButton: {
    paddingVertical: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
});

export default CustomChannelTypeSelector;
