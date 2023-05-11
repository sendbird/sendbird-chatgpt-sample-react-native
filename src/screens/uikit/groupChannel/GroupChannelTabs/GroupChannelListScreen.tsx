import React from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import CustomChannelTypeSelector from '../../../../components/CustomChannelTypeSelector';

const GroupChannelListFragment = createGroupChannelListFragment({
  TypeSelector: CustomChannelTypeSelector,
});
const GroupChannelListScreen = () => {
  const { navigation } = useAppNavigation<Routes.GroupChannelList>();

  return (
    <GroupChannelListFragment
      onPressCreateChannel={() => {
        // noop, see CustomChannelTypeSelector
      }}
      onPressChannel={(channel) => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url });
      }}
    />
  );
};

export default GroupChannelListScreen;
