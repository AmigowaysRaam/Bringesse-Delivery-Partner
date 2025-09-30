import {
  View,
  Text
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../resources/colors';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import FlashMessage from 'react-native-flash-message';
import HeaderBar from '../../../components/header';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <>
      <HeaderBar title={t('home')} showBackArrow={false} />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS[theme].background,
          alignSelf: 'center',
          justifyContent: 'center', // Center the content vertically
          alignItems: 'center', // Center the content horizontally
        }}
      >
        <FlashMessage position="Top" />
        <Text style={{ fontSize: 24, color: 'black' }}>{'Hi'}</Text>

      </View>
    </>
  );
};

export default HomeScreen;
