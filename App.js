/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import { cryptography } from '@liskhq/lisk-client';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import * as HashWasm from 'hash-wasm';

// import * as Argon2 from 'argon2-browser';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const encryptMe = async () => {
    try {
      console.log('...encrypting');
      // const messageBuff = Buffer.from('000000', 'hex');
      // const result = await Argon2.hash({pass: 'password', salt: 'somesalt'});
      const salt = cryptography.utils.getRandomBytes(16);
      console.log('salt', salt);

      const hashOptions = {
        password: 'password',
        salt: salt,
        parallelism: 1,
        iterations: 256,
        memorySize: 2024,
        hashLength: 32, // we use output size = 32 bytes
        outputType: 'binary', // we use output binary
      };

      const result = await HashWasm.argon2id(hashOptions);

      // const result = await cryptography.encrypt.encryptMessageWithPassword(
      //   'messagebuff',
      //   'password',
      // );
      console.log('result', result);
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Encrypt" onPress={encryptMe} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
