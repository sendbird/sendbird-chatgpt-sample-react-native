import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelFragment, MessageRenderer, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { Bots } from '../../../configurations';
import BotIncomingMessage from '../../../components/BotIncomingMessage';
import CustomGroupChannelMessageList from '../../../components/CustomGroupChannelMessageList';

const GroupChannelFragment = createGroupChannelFragment({ MessageList: CustomGroupChannelMessageList });

const GroupChannelScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>();

  const { sdk, currentUser } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelFragment
      channel={channel}
      searchItem={params.searchItem}
      onPressMediaMessage={(fileMessage, deleteMessage) => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        });
      }}
      onChannelDeleted={() => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to group channel settings
        navigation.push(Routes.GroupChannelSettings, params);
      }}
      renderMessage={(props) => {
        if (props.message.isUserMessage()) {
          const senderId = props.message.sender.userId;
          const isBotMessage = Object.values(Bots).some((it) => it.id === senderId);
          if (isBotMessage) {
            return <BotIncomingMessage {...props} />;
          }
        }
        return <MessageRenderer {...props} />;
      }}
    />
  );
};

export default GroupChannelScreen;
