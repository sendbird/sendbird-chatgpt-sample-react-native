import React, { useEffect } from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelList>();

  useEffect(() => {
    setTimeout(() => {
      if (params?.channelUrl) {
        navigation.navigate(Routes.GroupChannel, { channelUrl: params.channelUrl });
      }
    }, 500);
  }, [params?.channelUrl]);

  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        navigation.navigate(Routes.GroupChannelCreate, { channelType });
      }}
      onPressChannel={(channel) => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url });
      }}
    />
  );
};

export default GroupChannelListScreen;
