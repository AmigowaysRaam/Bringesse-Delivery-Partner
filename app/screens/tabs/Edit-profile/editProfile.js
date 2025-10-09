/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Platform,
  KeyboardAvoidingView, TouchableOpacity, Text,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { hp, wp } from '../../../resources/dimensions';
import { poppins } from '../../../resources/fonts';
import { COLORS } from '../../../resources/colors';
import { useTheme } from '../../../context/ThemeContext';
import HeaderBar from '../../../components/header';
import { useSelector } from 'react-redux';

const EditProfile = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const profileDetails = useSelector(state => state.Auth.profileDetails);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    phoneNumber: '',
    password: '',
    location: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formValues.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formValues.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formValues.email.trim()) newErrors.email = 'Email is required.';
    if (!formValues.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required.';
    if (!formValues.password.trim()) newErrors.password = 'Password is required.';
    if (!formValues.location.trim()) newErrors.location = 'Location is required.';
    if (!formValues.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      console.log('Submitted Profile Data:', formValues);
      // Submit logic here
    }
  };

  useEffect(() => {
    if (profileDetails) {
      // console?.log(profileDetails?.vehicle_category,"profileDetails")
      setFormValues({
        firstName: profileDetails?.first_name || '',
        lastName: profileDetails?.last_name || '',
        email: profileDetails?.email || '',
        mobileNumber: profileDetails?.phone_no || '',
        phoneNumber: profileDetails?.phone_no || '',
        password: '******', // password is kept empty for user to input
        location: profileDetails?.location || '',
      });
    }
  }, [profileDetails]);

  const renderTextField = (label, value, field, secure = false) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: COLORS[theme].textPrimary }]}>{label}</Text>
      <TextInput
        mode="outlined"
        value={value}
        style={styles.input}
        onChangeText={text => handleChange(field, text)}
        secureTextEntry={secure}
        outlineColor={errors[field] ? 'red' : COLORS[theme].textInputBorder}
        activeOutlineColor={COLORS[theme].textPrimary}
        textColor={COLORS[theme].textPrimary}
      />
      {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS[theme].background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <HeaderBar showBackArrow={true} title={t('edit_profile')} />

      <ScrollView
        style={{ paddingHorizontal: wp(5), marginTop: wp(3) }}
        showsVerticalScrollIndicator={false}
      >
        {renderTextField('First Name', formValues.firstName, 'firstName')}
        {renderTextField('Last Name', formValues.lastName, 'lastName')}
        {renderTextField('Email ID', formValues.email, 'email')}
        {renderTextField('Mobile Number', formValues.mobileNumber, 'mobileNumber')}
        {renderTextField('Phone Number', formValues.phoneNumber, 'phoneNumber')}
        {renderTextField('Location', formValues.location, 'location')}
        {renderTextField('Password', formValues.password, 'password', true)}

        <View style={{ marginTop: hp(2), marginBottom: hp(3) }}>
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            style={{
              backgroundColor: COLORS[theme].accent,
              paddingVertical: hp(1),
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                poppins.regular.h4,
                { color: COLORS[theme].white },
              ]}
            >
              {t('save')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: hp(2),
  },
  label: {
    marginBottom: hp(0.8),
    fontSize: wp(3.8),
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    height: hp(5.5),
  },
  errorText: {
    color: 'red',
    marginTop: hp(0.5),
    fontSize: wp(3.5),
  },
});

export default EditProfile;
