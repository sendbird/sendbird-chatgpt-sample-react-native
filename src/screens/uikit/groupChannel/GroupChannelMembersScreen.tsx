import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import {
  createGroupChannelMembersFragment,
  useLocalization,
  UserActionBar,
  useSendbirdChat,
  useUserProfile,
} from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { ifOperator, ifThenOr } from '@sendbird/uikit-utils';
import { ActionMenuItem, useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { Role } from '@sendbird/chat';
import { BotIds } from '../../../botInformation';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const GroupChannelMembersScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();

  const { STRINGS } = useLocalization();
  const { sdk, currentUser } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);

  const { openMenu } = useActionMenu();
  const { show } = useUserProfile();

  if (!channel) return null;

  return (
    <GroupChannelMembersFragment
      channel={channel}
      renderUser={(user) => {
        const meOperator = channel.myRole === Role.OPERATOR;
        const userNotBot = Object.values(BotIds).every((id) => user.userId !== id);

        return (
          <UserActionBar
            muted={user.isMuted}
            uri={user.profileUrl}
            label={user.role === 'operator' ? STRINGS.LABELS.USER_BAR_OPERATOR : ''}
            name={
              (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
              (user.userId === currentUser?.userId ? STRINGS.LABELS.USER_BAR_ME_POSTFIX : '')
            }
            disabled={user.userId === currentUser?.userId}
            onPressActionMenu={ifThenOr(meOperator && userNotBot, () => {
              const menuItems: ActionMenuItem['menuItems'] = [];

              menuItems.push({
                title: ifOperator(user.role, STRINGS.LABELS.UNREGISTER_OPERATOR, STRINGS.LABELS.REGISTER_AS_OPERATOR),
                onPress: ifOperator(
                  user.role,
                  () => channel.removeOperators([user.userId]),
                  () => channel.addOperators([user.userId]),
                ),
              });

              if (!channel.isBroadcast) {
                menuItems.push({
                  title: ifThenOr(user.isMuted, STRINGS.LABELS.UNMUTE, STRINGS.LABELS.MUTE),
                  onPress: ifThenOr(
                    user.isMuted,
                    () => channel.unmuteUser(user),
                    () => channel.muteUser(user),
                  ),
                });
              }

              menuItems.push({
                title: STRINGS.LABELS.BAN,
                style: 'destructive',
                onPress: () => channel.banUser(user),
              });

              openMenu({ title: user.nickname || STRINGS.LABELS.USER_NO_NAME, menuItems });
            })}
            onPressAvatar={() => show(user)}
          />
        );
      }}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        navigation.push(Routes.GroupChannelInvite, params);
      }}
    />
  );
};

export default GroupChannelMembersScreen;
