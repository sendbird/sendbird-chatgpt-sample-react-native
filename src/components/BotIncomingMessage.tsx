import { Image, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { GroupChannelProps } from '@sendbird/uikit-react-native';
import { UserMessage } from '@sendbird/chat/message';
import { Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { format } from 'date-fns';

const BotIncomingMessage: GroupChannelProps['MessageList']['renderMessage'] = ({
  message,
  onPress,
  onLongPress,
  onPressAvatar,
  // channel,
  // prevMessage,
  // nextMessage,
  // enableMessageGrouping,
  // currentUserId,
}) => {
  const { colors, select, palette } = useUIKitTheme();

  // const { groupWithPrev, groupWithNext } = calcMessageGrouping(
  //   enableMessageGrouping,
  //   message,
  //   prevMessage,
  //   nextMessage,
  // );

  const userMessage = message as UserMessage;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => {
        const color = colors.ui.groupChannelMessage.incoming[pressed ? 'pressed' : 'enabled'];
        return (
          <View style={styles.container}>
            <View style={styles.avatarContainer}>
              <Pressable onPress={() => onPressAvatar?.(userMessage.sender)}>
                <Image source={{ uri: userMessage.sender.profileUrl }} style={styles.avatar} />
              </Pressable>
            </View>
            <View style={styles.bubbleContainer}>
              <View style={styles.bubbleWrapper}>
                <Text color={color.textSenderName} caption1 style={{ marginBottom: 4 }}>
                  {userMessage.sender.nickname}
                </Text>
                <View
                  style={[
                    styles.bubble,
                    {
                      borderColor: colors.onBackground04,
                      backgroundColor: pressed
                        ? select({ light: palette.background100, dark: palette.background500 })
                        : 'transparent',
                    },
                  ]}
                >
                  <Text body3 color={color.textMsg}>
                    {userMessage.message}
                  </Text>
                </View>
              </View>
              <Text caption4 color={color.textTime}>
                {format(userMessage.createdAt, 'p')}
              </Text>
            </View>
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleWrapper: {
    marginRight: 4,
  },
  bubble: {
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 250,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
export default BotIncomingMessage;
