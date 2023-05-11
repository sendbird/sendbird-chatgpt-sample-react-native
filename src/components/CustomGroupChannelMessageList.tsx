import { GroupChannelContexts, GroupChannelProps, useSendbirdChat } from '@sendbird/uikit-react-native';
import React, { useContext, useEffect, useId, useRef } from 'react';
import { FlatList } from 'react-native';
import { SendbirdMessage, useFreshCallback } from '@sendbird/uikit-utils';
import CustomMessageList from './CustomMessageList';
import { useChannelHandler } from '@sendbird/uikit-chat-hooks';

const GroupChannelMessageList = (props: GroupChannelProps['MessageList']) => {
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit } = useContext(GroupChannelContexts.Fragment);
  const { subscribe } = useContext(GroupChannelContexts.PubSub);

  const id = useId();
  const ref = useRef<FlatList<SendbirdMessage>>(null);

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = (animated = false, timeout = 0) => {
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: 0, animated });
    }, timeout);
  };

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToIndex = (index = 0, animated = false, timeout = 0) => {
    setTimeout(() => {
      ref.current?.scrollToIndex({ index, animated, viewPosition: 0.5 });
    }, timeout);
  };

  useEffect(() => {
    if (props.searchItem) {
      const createdAt = props.searchItem.startingPoint;
      const foundMessageIndex = props.messages.findIndex((it) => it.createdAt === createdAt);
      const isIncludedInList = foundMessageIndex > -1;
      if (isIncludedInList) {
        lazyScrollToIndex(foundMessageIndex, true, 500);
      }
    }
  }, [props.searchItem]);

  const scrollToBottom = useFreshCallback((animated = false) => {
    if (props.hasNext()) {
      props.onResetMessageList(() => {
        lazyScrollToBottom(animated);
        props.onScrolledAwayFromBottom(false);
      });
    } else {
      lazyScrollToBottom(animated);
    }
  });

  useChannelHandler(sdk, id, {
    onReactionUpdated(channel, event) {
      if (channel.url !== props.channel.url) return;
      const recentMessage = props.messages[0];
      const isRecentMessage = recentMessage && recentMessage.messageId === event.messageId;
      const scrollReachedBottomAndCanScroll = !props.scrolledAwayFromBottom && !props.hasNext();
      if (isRecentMessage && scrollReachedBottomAndCanScroll) {
        lazyScrollToBottom(true, 250);
      }
    },
  });

  useEffect(() => {
    return subscribe(({ type }) => {
      switch (type) {
        case 'MESSAGES_RECEIVED': {
          if (!props.scrolledAwayFromBottom) {
            scrollToBottom(true);
          }
          break;
        }
        case 'MESSAGE_SENT_SUCCESS':
        case 'MESSAGE_SENT_PENDING': {
          scrollToBottom(false);
          break;
        }
      }
    });
  }, [props.scrolledAwayFromBottom]);

  return (
    <CustomMessageList
      {...props}
      ref={ref}
      onEditMessage={setMessageToEdit}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
    />
  );
};

export default React.memo(GroupChannelMessageList);
