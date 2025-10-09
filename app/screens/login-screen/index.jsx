/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, ScrollView, StyleSheet, TouchableWithoutFeedback, View,
  TextInput, TouchableOpacity, Text, Platform,
} from 'react-native';
import { hp, wp } from '../../resources/dimensions';
import { poppins } from '../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../resources/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../../components/header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthHoc } from '../../config/config';
import { useDispatch } from 'react-redux';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';

const LoginScreen = () => {
  // Hooks
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    actions: { APP_REGISTER_LOGIN_API_CALL },
  } = useAuthHoc();
  // State
  const [email, setEmail] = useState('Contact.sme.central@gmail.com');
  const [password, setPassword] = useState('50974900');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Get FCM token and device ID on mount
  useEffect(() => {
    const init = async () => {
      try {
        const token = await messaging().getToken();
        const id = await DeviceInfo.getUniqueId();
        // Alert.alert(JSON.stringify(token));
        setFcmToken(token);
        setDeviceId(id);
      } catch (error) {
        console.log('Error fetching device info:', error);
      }
    };
    init();
  }, []);

  // Handle Login
  const handleSubmit = async () => {
    setEmailError('');
    setPasswordError('');
    // Validation
    if (!email) return setEmailError(t('Email is required.'));
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) return setEmailError(t('Please enter a valid email address.'));
    if (!password) return setPasswordError(t('Password is required.'));
    if (password.length < 6) return setPasswordError(t('Password must be at least 6 characters.'));
    // API call
    APP_REGISTER_LOGIN_API_CALL({
      request: {
        payload: {
          email,
          password,
          device_token: fcmToken,
          device_type: Platform.OS === 'ios' ? 0 : 1,
          device_id: deviceId,
        },
      },
      callback: {
        async successCallback({ message, data }) {
          const userDatas = data.data;
          console.log('Login Success:', userDatas);
          if (userDatas?.status) {
            try {
              await AsyncStorage.setItem('user_data', JSON.stringify(userDatas));
              console.log('User data saved');
            } catch (error) {
              console.error('AsyncStorage error:', error);
            }
            // Show success
            showMessage({
              message: userDatas?.message,
              description: userDatas?.message,
              type: 'success',
            });
            const { access_token, refresh_token, ...profileData } = userDatas;
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', refresh_token);
            // Redux update
            dispatch({
              type: 'UPDATE_PROFILE',
              payload: profileData,
            });
            // Store access and refresh tokens
            dispatch({
              type: 'SET_TOKENS',
              payload: {
                access_token: access_token,
                refresh_token: refresh_token,
              },
            });
            // Navigate
            navigation.replace('home-screen');
          } else {
            showMessage({
              message: t('Login Failed'),
              description: userDatas.message || t('Something went wrong'),
              type: 'danger',
            });
          }
        },
        errorCallback(errMsg) {
          console.error('Login Error:', errMsg);
          showMessage({
            message: t('Error'),
            description: errMsg || t('An unexpected error occurred.'),
            type: 'danger',
          });
        },
      },
    });
  };
  return (
    <TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: COLORS[theme].background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlashMessage position="top" />
        <HeaderBar title={t('Login')} showBackArrow={true} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Email Field */}
          <Text style={[poppins.regular.h7, styles.label, { color: COLORS[theme].textPrimary }]}>
            {t('Email_Id')}
          </Text>
          <TextInput
            style={[styles.inputField, { color: COLORS[theme].textPrimary }]}
            placeholder={t('Email_Id')}
            placeholderTextColor={COLORS[theme].textPrimary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password Field */}
          <Text style={[poppins.regular.h7, styles.label, { color: COLORS[theme].textPrimary }]}>
            {t('Password')}
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.inputField, { flex: 1, color: COLORS[theme].textPrimary }]}
              placeholder={t('Password')}
              placeholderTextColor={COLORS[theme].textPrimary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcon
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color={COLORS[theme].textPrimary}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </ScrollView>
        <Text style={[poppins.regular.h7, { color: COLORS[theme].textPrimary, alignSelf: "center" }]}>
          {t('Register New user?')} <Text style={{ color: COLORS[theme].accent }} onPress={() => navigation.navigate('RegisterScreen')}>{t('Register')}</Text>
        </Text>
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: COLORS[theme].accent }]}
        >
          <Text style={[poppins.regular.h3, { color: COLORS[theme].white }]}>
            {t('Submit')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;
const styles = StyleSheet.create({
  container: { flex: 1, },
  scrollContainer: {
    flexGrow: 1, alignItems: 'center',
  },
  inputField: {
    width: wp(90), height: hp(6),
    borderWidth: 1, borderColor: '#CCC',
    borderRadius: 8, marginBottom: hp(2), paddingLeft: wp(3),
    fontSize: wp(4),
  },
  passwordContainer: {
    width: wp(90), flexDirection: 'row', alignItems: 'center',
    marginBottom: hp(2), borderRadius: 8,
  },
  eyeIcon: {
    position: 'absolute', right: wp(3),
    top: hp(1.5),
  },
  errorText: {
    fontSize: wp(3.5),
    color: 'red', alignSelf: 'flex-start',
    marginHorizontal: wp(5), marginBottom: hp(1),
  },
  submitButton: {
    width: wp(90), height: hp(6), borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginTop: hp(2), marginBottom: hp(3),
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'flex-start', paddingHorizontal: wp(5),
    marginBottom: hp(1),
  },
});
