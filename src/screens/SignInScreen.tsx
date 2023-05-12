import React, { useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, View } from 'react-native';
import { useConnection } from '@sendbird/uikit-react-native';
import { Button, Text, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import Versions from '../components/Versions';
import { useAppAuth } from '../libs/authentication';
import { USER_ID, NICKNAME } from '../configurations';

const SignInScreen = () => {
  const [userId, setUserId] = useState(USER_ID);
  const [nickname, setNickname] = useState(NICKNAME);
  const [loading, setLoading] = useState(false);

  const { connect } = useConnection();

  const { loading: autoSignInLoading, signIn } = useAppAuth(async (user) => {
    await connect(user.userId, { nickname: user.nickname });
  });
  const { colors } = useUIKitTheme();

  if (autoSignInLoading) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image style={styles.logo} source={require('../assets/logoSendbird.png')} />
      <Text style={styles.title}>{'RN-UIKit ChatGPT sample'}</Text>
      <TextInput
        placeholder={'User ID'}
        value={userId}
        onChangeText={setUserId}
        style={[styles.input, { backgroundColor: colors.onBackground04, marginBottom: 12 }]}
      />
      <TextInput
        placeholder={'Nickname'}
        value={nickname}
        onChangeText={setNickname}
        style={[styles.input, { backgroundColor: colors.onBackground04 }]}
      />
      <Button
        style={styles.btn}
        variant={'contained'}
        onPress={async () => {
          if (userId && !loading) {
            setLoading(true);
            await signIn({ userId, nickname });
            await connect(userId, { nickname });
          }
        }}
      >
        {loading ? <ActivityIndicator color={'white'} /> : 'Sign in'}
      </Button>

      <Versions style={{ marginTop: 12 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 34,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
  },
  input: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default SignInScreen;
