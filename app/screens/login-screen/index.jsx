/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { hp, wp } from '../../resources/dimensions';
import { poppins } from '../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { COLORS } from '../../resources/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../../components/header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = () => {
    setEmailError('');
    setPasswordError('');

    // Email Validation
    if (!email) {
      setEmailError(t('Email is required.'));
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setEmailError(t('Please enter a valid email address.'));
      return;
    }

    // Password Validation
    if (!password) {
      setPasswordError(t('Password is required.'));
      return;
    }

    if (password.length < 6) {
      setPasswordError(t('Password must be at least 6 characters.'));
      return;
    }
    // If all validations pass
    navigation.navigate('home-screen');
    alert(t('Login Successful!'));
  };
  return (
    <TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: COLORS[theme].background }]}
        behavior="padding"
      >
        <HeaderBar title={t('Login')} showBackArrow={false} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Email Input Field */}
          <Text style={[poppins.regular.h7, { alignSelf: 'flex-start', paddingHorizontal: hp(3), marginVertical: wp(2) }]}>
            {t('Email_Id')}
          </Text>
          <TextInput
            style={[styles.inputField, { borderColor: '#CCC',color:COLORS[theme].primary }]}
            placeholder={t('Email_Id')}
            placeholderTextColor={COLORS[theme].primary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Email Error Message */}
          {emailError ? (
            <Text style={[styles.errorText, { color: 'red' }]}>{emailError}</Text>
          ) : null}
          {/* Password Input Field */}
          <Text style={[poppins.regular.h7, { alignSelf: 'flex-start', paddingHorizontal: hp(3), marginVertical: wp(2) }]}>
            {t('Password')}
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.inputField, { borderColor: '#CCC',color:COLORS[theme].primary }]}
              placeholder={t('Password')}
              placeholderTextColor={COLORS[theme].primary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
              <MaterialCommunityIcon
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color={COLORS[theme].primary}
              />
            </TouchableOpacity>
          </View>
          {/* Password Error Message */}
          {passwordError ? (
            <Text style={[styles.errorText, { color: 'red' }]}>{passwordError}</Text>
          ) : null}
        </ScrollView>
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: COLORS[theme].accent }]}
        >
          <Text style={[poppins.regular.h3, { color: COLORS[theme].white }]}>{t('Submit')}</Text>
        </TouchableOpacity>
        <FlashMessage position="top" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inputField: {
    width: wp(90),
    height: hp(6),
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: hp(2),
    paddingLeft: wp(3),
    fontSize: wp(4),
  },
  passwordContainer: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    borderRadius: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: wp(3),
    top: hp(1.5),
  },
  errorText: {
    fontSize: wp(4),
    alignSelf:"flex-start",marginHorizontal:wp(5)
  },
  submitButton: {
    width: wp(90),
    height: hp(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(3),
    alignSelf: 'center',
  },
  footerContainer: {
    padding: wp(4),
  },
});
