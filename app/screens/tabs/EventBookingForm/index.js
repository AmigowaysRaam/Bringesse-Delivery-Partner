
import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { hp, wp } from '../../../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
import { useAuthHoc } from '../../../config/config';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import UseProfileHook from '../../../hooks/profile-hooks';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../resources/colors';
import HeaderBar from '../../../components/header';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-paper-dropdown';
import { poppins } from '../../../resources/fonts';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const EventBookingForm = ({ route }) => {

  const { theme } = useTheme();
  const { t } = useTranslation();
  const { detail } = route.params;


  const {
    reducerConstants: { },
    actions: { GET_USER_PROFILE_DATA_API_CALL, GET_APP_TSHIRT_CALL },
  } = useAuthHoc();

  const [loggedUserData, setUserLoggedData] = useState(null);


  const { profile } = UseProfileHook();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const [medalValue, setMedalCheck] = useState(false);

  const [tshirtCheck, setTshirtCheck] = useState(false);


  const [tShirtArray, setTshirtArray] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '', // Added gender field
    tshirtSize: '', // New field for T-shirt size
    selectedTripDate: '',
    customName: ''
  });

  useEffect(() => {


    fnGetUserProData();
    GET_APP_TSHIRT_CALL({
      request: {
        payload: {
          userid: profile.id,
          locale: 'en',
        },
      },
      callback: {
        successCallback({ message, data }) {
          if (data.data) {
            // Mapping the array
            const sizeOptions = data?.data.map(item => ({
              label: item.name,  // Setting 'name' as label
              value: item.id     // Setting 'id' as value
            }));
            setTshirtArray(sizeOptions)
          }
        },
        errorCallback(message) {
          console.log(message);
        },
      },
    });

  }, [profile.id]);



  const CustomDropdownInput = ({ placeholder, selectedLabel, rightIcon }) => {
    return (
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        value={selectedLabel}
        style={[poppins.regular.h6, { height: hp(5), borderWidth: wp(0.2) }]}
        right={rightIcon}
      />
    );
  };

  function fnGetUserProData() {
    setIsLoading(true);

    GET_USER_PROFILE_DATA_API_CALL({
      request: {
        payload: {
          userid: profile.id,
          locale: 'en',
        },
      },
      callback: {
        successCallback({ message, data }) {
          if (data.data) {
            setFormValues({
              firstName: data?.data?.first_name || '',
              lastName: data?.data?.last_name || '',
              email: data.data?.email || '',
              mobileNumber: data?.data?.mobile || '',
              gender: data?.data?.gender || '',
              tshirtSize: data?.data?.tshirtSize || '',  // Optional field based on your data
            });
            setImageUri(data?.data?.image_profile);
            setUserLoggedData(data?.data);
            setIsLoading(false);
          }
        }
        ,
        errorCallback(message) {
          console.log(message);
        },
      },
    });
  }


  const handleSubmit = () => {

    if (!formValues.tshirtSize) {
      // Show error message if no T-shirt size is selecte
      Toast.show({
        type: 'error',  // You can use 'success', 'error', 'info', etc.
        position: 'top',  // Positioning can be 'top', 'bottom', or 'center'
        text1: t('pls_select_tshirt_size'),  // Main text
        visibilityTime: 2000,  // Duration for which the toast is visible
        autoHide: true,  // Toast hides automatically after the specified time
      });

      return; // Prevent form submission if validation fails
    }
    if (!formValues.gender) {

      Toast.show({
        type: 'error',  // You can use 'success', 'error', 'info', etc.
        position: 'top',  // Positioning can be 'top', 'bottom', or 'center'
        text1: t(
          'pls_select_gender'
        ),  // Main text
        visibilityTime: 2000,  // Duration for which the toast is visible
        autoHide: true,  // Toast hides automatically after the specified time
      });
      return; // Prevent form submission if validation fails
    }

    if (!formValues.customName && tshirtCheck) {
      Toast.show({
        type: 'error',  // You can use 'success', 'error', 'info', etc.
        position: 'top',  // Positioning can be 'top', 'bottom', or 'center'
        text1: t(
          'enter_custom_name'
        ),  // Main text
        visibilityTime: 2000,  // Duration for which the toast is visible
        autoHide: true,  // Toast hides automatically after the specified time
      });
      return; // Prevent form submission if validation fails
    }

    let payload = {
      userid: profile.id,
      id: detail?.id,
      mobile: formValues?.mobileNumber,
      email: formValues?.email,
      first_name: formValues?.firstName,
      last_name: formValues?.lastName,
      gender: formValues?.gender, // Send gender as part of the request
      size: formValues?.tshirtSize,
      medal_print: medalValue ? 1 : 0,
      locale: 'en',
      tshirtCheck: tshirtCheck ? 1 : 0,
      custom_name: tshirtCheck ? formValues?.customName : ''
    }


    navigation.navigate('EventSummary', { data: payload })

  };

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Gender dropdown options
  const genderOptions = [
    { label: t('male'), value: '1' },
    { label: t('female'), value: '2' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS[theme].background }}>
      <HeaderBar showTitleOnly showBackArrow title={t('eventbooking')} />
      <ScrollView
        style={{
          marginHorizontal: wp(5),
          flex: 1,
          backgroundColor: COLORS[theme].backgroundColor,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ?
          <ActivityIndicator style={{ marginTop: wp(10) }} />
          :
          <>
            <View style={{ width: wp(90) }}>
              <View style={styles.nameRow}>
                <TextInput
                  // disabled={true}
                  editable={false}
                  placeholder="Enter First Name"
                  style={styles.inputUserName}
                  mode="outlined"
                  value={formValues.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  left={<TextInput.Icon icon={'account'} />}
                />
                <TextInput
                  editable={false}

                  placeholder="Enter Last Name"
                  style={styles.inputUserName}
                  mode="outlined"
                  value={formValues.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  left={<TextInput.Icon icon={'account'} />}
                />
              </View>

              {/* Mobile Number */}
              <TextInput
                editable={false}

                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                style={styles.input}
                mode="outlined"
                value={formValues.mobileNumber}
                onChangeText={(text) => handleChange('mobileNumber', text)}
                left={<TextInput.Icon icon={'phone'} />}
              />

              {/* Email */}
              <TextInput
                editable={false}

                placeholder="Enter Email"
                keyboardType="email-address"
                style={styles.input}
                mode="outlined"
                value={formValues.email}
                onChangeText={(text) => handleChange('email', text)}
                left={<TextInput.Icon icon={'email'} />}
              />

              {/* Gender Dropdown */}
              <Text
                style={[
                  poppins.regular.h8,
                  { color: COLORS[theme].textPrimary, marginVertical: wp(2) },
                ]}
              >
                {`${t('select_gender')} *`}
              </Text>
              <Dropdown
                menuContentStyle={{ backgroundColor: '#fff' }}
                placeholder={t('select_gender')}
                mode="outlined"
                options={genderOptions || []}
                value={formValues.gender}
                onSelect={(value) => handleChange('gender', value)}
                CustomDropdownInput={CustomDropdownInput}
              />

              {/* T-shirt Size Dropdown */}
              <Text
                style={[
                  poppins.regular.h8,
                  { color: COLORS[theme].textPrimary, marginVertical: wp(2) },
                ]}
              >
                {`${t('select_tshirt_size')} * `}
              </Text>
              <Dropdown
                menuContentStyle={{ backgroundColor: '#fff' }}
                placeholder={t('select_size')}
                mode="outlined"
                options={tShirtArray || []}
                value={formValues.tshirtSize}
                onSelect={(value) => handleChange('tshirtSize', value)}
                CustomDropdownInput={CustomDropdownInput}
              />

              {
                detail?.is_medal == 1 &&
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => {
                    setMedalCheck(!medalValue);
                  }}>
                  <IonicIcon
                    name={medalValue ? "checkbox" : "square-outline"}
                    style={{
                      marginHorizontal: wp(2),
                    }}
                    color={COLORS[theme].textPrimary}
                    size={24}
                  />
                  <Text style={{ color: COLORS[theme].textPrimary }}>
                    {t('medal_print')}
                  </Text>
                </TouchableOpacity>
              }


              {
                detail?.is_tshirt == 1 &&
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => {
                    setTshirtCheck(!tshirtCheck);
                  }}>
                  <IonicIcon
                    name={tshirtCheck ? "checkbox" : "square-outline"}
                    style={{
                      marginHorizontal: wp(2),
                    }}
                    color={COLORS[theme].textPrimary}
                    size={24}
                  />
                  <Text style={{ color: COLORS[theme].textPrimary }}>
                    {t('tshirt_printing')}
                  </Text>
                </TouchableOpacity>
              }

              {
                tshirtCheck &&
                <>
                  <Text
                    style={[
                      poppins.regular.h8,
                      { color: COLORS[theme].textPrimary, marginVertical: wp(2) },
                    ]}
                  >
                    {`${t('custom_name')} * `}
                  </Text>
                  <TextInput
                    placeholder={t('custom_name')}
                    // keyboardType="phone-pad"
                    style={styles.input}
                    mode="outlined"
                    value={formValues.customName}
                    onChangeText={(text) => handleChange('customName', text)}
                    left={<TextInput.Icon icon={'tshirt-crew'} />}
                  /></>
              }
            </View>
          </>
        }
      </ScrollView>

      <Button
        mode="contained"
        style={{
          marginTop: hp(3),
          width: wp(94),
          height: hp(6),
          marginHorizontal: wp(3),
          marginVertical: wp(3),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS[theme].buttonBg,
        }}
        labelStyle={[poppins.bold.h6, { color: COLORS[theme].buttonText }]}
        onPress={() => handleSubmit()}
      >
        {t('submit')}
      </Button>
      <Toast />

      {/* <FlashMessage position="top" /> */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: wp(90),
    height: hp(6),
    marginVertical: wp(2),
  },
  inputUserName: {
    width: wp(44),
    height: hp(6),
    marginVertical: wp(2),
  },
  checkboxContainer: {

    marginTop: wp(3),
    marginVertical: wp(2), flexDirection: 'row',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp(2),
  },
});

export default EventBookingForm;

