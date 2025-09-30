/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { IMAGE_ASSETS } from '../../../resources/images';
import { hp, wp } from '../../../resources/dimensions';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { poppins } from '../../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import { useAuthHoc } from '../../../config/config';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { launchImageLibrary } from 'react-native-image-picker';
import UseProfileHook from '../../../hooks/profile-hooks';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../resources/colors';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBar from '../../../components/header';

const pickImage = setImageUri => {

  // launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
  //   if (response.didCancel) {
  //     console.log('User canceled image picker');
  //   } else if (response.errorCode) {
  //     console.log('ImagePicker Error: ', response.errorMessage);
  //   } else {
  //     setImageUri(response.assets[0].uri);
  //     console.log(response.assets[0].uri, 'uri');
  //   }
  // });
  // 
  ImagePicker.openPicker({
    mediaType: 'photo',
    cropping: true,
    cropperCircleOverlay: true,
    cropperToolbarTitle: '',
    compressImageMaxWidth: 500,
    compressImageMaxHeight: 500,
    compressImageQuality: 0.7,
  })
    .then(image => {
      // Send the cropped image URI
      const croppedImageUri = image.path;
      console.log('Cropped Image URI:', croppedImageUri);

      // Now you can use croppedImageUri to upload or further process the image
      setImageUri(croppedImageUri); // Example function to handle the image
    })
    .catch(error => {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log('User canceled image picker');
      } else {
        console.error('ImagePicker Error: ', error);
      }
    });

};

const EditProfileScreen = () => {

  const { theme } = useTheme();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    reducerConstants: { },
    reducerName,
    actions: { GET_USER_PROFILE_DATA_API_CALL },
  } = useAuthHoc();
  const [loggedUserData, setUserLoggedData] = useState();
  const [userName, setuserName] = useState('');

  const { profile } = UseProfileHook();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [isEdit, setIsEdit] = useState(true);

  const [formValues, setFormValues] = useState({
    userName: loggedUserData?.first_name,
    last_name: loggedUserData?.last_name,
    email: loggedUserData?.email,
    mobileNumber: loggedUserData?.mobile,
    dateOfBirth: moment(loggedUserData?.birth_date, 'YYYY-MM-DD')
      .format('DD/MM/YYYY')
      .toString(),
    instagram: loggedUserData?.instagram || '',  // New field
    facebook: loggedUserData?.facebook || '',  // New field
    youtube: loggedUserData?.youtube || '',  // New field
    tiktok: loggedUserData?.tiktok || '',  // New field
    pinterest: loggedUserData?.pinterest || '',  // New field
    twitter: loggedUserData?.twitter || '',  // New field

    bio: loggedUserData?.bio || '',  // New field
    snap: loggedUserData?.snap || '',  // New field

  });

  const [date, setDate] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fnGetUserProData();
    });
    return unsubscribe;
  }, [navigation, profile.id]);

  useEffect(() => {
    setIsEdit(true);
    fnGetUserProData();
  }, [profile.id]);

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
            formValues.first_name = data?.data?.first_name;
            formValues.last_name = data?.data?.last_name;
            formValues.bio = data?.data?.bio;
            formValues.twitter = data?.data?.twitter;
            formValues.instagram = data?.data?.instagram;
            formValues.snap = data?.data?.snap;
            formValues.email = data.data?.email;
            formValues.mobileNumber = data?.data?.mobile;
            formValues.dateOfBirth = moment(
              data?.data?.birth_day,
              'YYYY-MM-DD',
            )
              .format('DD/MM/YYYY')
              .toString();
            setImageUri(data?.data?.image_profile);
            setUserLoggedData(data?.data);
            setuserName(data?.data?.user_name)
            setIsLoading(false);
          }
        },
        errorCallback(message) {
          console.log(message);
        },
      },
    });
  }
  const [formErrors, setFormErrors] = useState({
    first_name: '',
    last_name: '',
    userName: '',
    email: '',
    imageUri: '',
    mobileNumber: ''
  });


  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    params => {
      setOpen(false);
      // const formattedDate = moment(params.date).format('DD/MM/YYYY');
      const formattedDate = moment(params.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      setDate(params.date);
      handleChange('dateOfBirth', formattedDate);
      // console.log('dateOfBirth', formattedDate);
    },
    [handleChange],
  );

  const openDatePicker = () => {
    setOpen(true);
  };

  function onUpdateComplete(message) {
    // setIsLoading(false);
    showMessage({
      message: message,
      type: 'success',
      duration: 3000,
      titleStyle: {
        color: '#FFFFFF', // Text color
        marginBottom: wp(Platform.OS !== 'ios' ? 2 : 5)
      },
      style: {
        wordWrap: 'break-word',
        maxHeight: Platform.OS !== 'ios' ? '80%' : '60%',
        justifyContent: "center",
      },

    });

    setTimeout(() => {
      navigation.goBack();
      // setIsLoading(false);
    }, 1000);
  }




  const handleSubmit = () => {

    setIsLoading(true);
    if (!formValues.first_name || !formValues.last_name) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        first_name: 'First name is required.',
        last_name: 'Last name is required.'
      }));
      setIsLoading(false);
      return;
    }

    if (!formValues.email) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email is required.'
      }));
      setIsLoading(false);
      return;
    }



    if (!formValues.mobileNumber) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        mobileNumber: 'Mobile Number is required.'
      }));
      setIsLoading(false);
      return;
    }


    // Ensure the image is selected
    // if (!imageUri) {
    //   setFormErrors(prevErrors => ({
    //     ...prevErrors,
    //     imageUri: 'Profile image is required.'
    //   }));
    //   setIsLoading(false);
    //   return;
    // }

    // If validation passes, proceed with form submission
    const formData = new FormData();



    formData.append('first_name', formValues.first_name);
    formData.append('last_name', formValues.last_name);
    formData.append('userid', profile.id);
    formData.append('email', formValues.email);
    formData.append('dateOfBirth', date);
    const imageFile = {
      uri: Platform.OS === 'ios' ? imageUri : imageUri,
      type: 'image/jpeg',
      name: formValues.first_name + '_proPhoto.jpg',
    };
    formData.append('image', imageFile);

    // Add social media handles to formData
    if (formValues.instagram) formData.append('instagram', formValues.instagram);
    if (formValues.facebook) formData.append('facebook', formValues.facebook);
    if (formValues.youtube) formData.append('youtube', formValues.youtube);
    if (formValues.tiktok) formData.append('tiktok', formValues.tiktok);
    if (formValues.pinterest) formData.append('pinterest', formValues.pinterest);
    if (formValues.twitter) formData.append('twitter', formValues.twitter);
    if (formValues.bio) formData.append('bio', formValues.bio);
    if (formValues.snap) formData.append('snap', formValues.snap);


    // Create request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;',
      },
      body: formData,
      redirect: 'follow',
    };

    // Submit the form
    fetch(
      'https://www.thundersgym.com/app-user-update-profile',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {

        AsyncStorage.setItem('user_data', JSON.stringify(result));
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: result.data.user_data,
        });
        onUpdateComplete(result.message);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleChange = (name, value) => {

    setFormErrors({})
    setFormValues({ ...formValues, [name]: value });
    if (name === 'email') {
      // validateEmail(value.trim());
    }
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrors({
        ...errors,
        email: 'Please enter a valid email address.',
      });
    } else {
      setErrors({
        ...errors,
        email: '', // Clear error if email is valid
      });
    }
  };


  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS[theme].background, flex: 1 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IonicIcon name="chevron-back" size={24} color={COLORS[theme].textPrimary} />
        </TouchableOpacity>
      </View> */}

      <HeaderBar showTitleOnly title={t('edit_profile')} />



      {
        isLoading
          ?
          <ActivityIndicator color={COLORS[theme].textPrimary} />
          :
          <>

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: wp(4), marginTop: wp(1) }}>
              <TouchableOpacity onPress={() => pickImage(setImageUri)}>
                <Image
                  source={imageUri ? { uri: imageUri } : IMAGE_ASSETS.avatar}
                  style={{
                    width: wp(30),
                    height: wp(30),
                    borderRadius: 100,
                    borderWidth: 3,
                    borderColor: COLORS[theme].textPrimary
                  }}
                />
                <View
                  style={{ position: "absolute", bottom: wp(2), right: wp(2), backgroundColor: "#FFF", borderRadius: wp(5), borderColor: COLORS[theme].accent, borderWidth: wp(0.4), padding: wp(1) }}
                >
                  <IonicIcon name="pencil" size={18} color={COLORS[theme].black} />
                </View>
              </TouchableOpacity>
            </View>
            {
              userName !== "" &&
              <Text
                numberOfLines={1}
                style={[poppins.regular.h6, { width: wp(75), alignSelf: 'center', textAlign: "center", color: COLORS[theme].textPrimary, marginVertical: wp(1) }]}>{userName ? userName : ''}</Text>
            }
            <ScrollView style={{ marginHorizontal: wp(5), flex: 1, marginBottom: wp(10) }} showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: wp(5) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 0.5,
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    maxLength={25}
                    outlineStyle={{ marginVertical: wp(1) }}
                    placeholder="Enter First Name*"
                    style={[poppins.regular.h8, { width: wp(43) }]}
                    mode="outlined"
                    inputMode="text"
                    onChangeText={text => handleChange('first_name', text)}
                    value={formValues.first_name}
                    left={<TextInput.Icon icon={'account'} />}
                  />
                  <TextInput
                    maxLength={25}
                    outlineStyle={{ marginVertical: wp(1), }}
                    placeholder="Enter Last Name*"
                    style={[poppins.regular.h8, { width: wp(43) }]}
                    mode="outlined"
                    onChangeText={text => handleChange('last_name', text)}
                    value={formValues.last_name}
                    left={<TextInput.Icon icon={'account'} />}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <View style={{ flex: 1, justifyContent: 'center', }}>
                    {formErrors.first_name && (
                      <Text
                        style={[poppins.regular.h8, { color: "red" }]}
                      >{formErrors.first_name}</Text>
                    )}
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', }}>
                    {formErrors.last_name && (
                      <Text
                        style={[poppins.regular.h8, { color: "red" }]}
                      >{formErrors.last_name}</Text>
                    )}
                  </View>
                </View>

                {/* Mobile Number */}
                <TextInput
                  disabled={true}
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                  keyboardType="phone-pad"
                  style={[styles.input,{borderColor:'#ccc'}]}
                  mode="outlined"
                  value={formValues.mobileNumber}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9+]/g, '') // Allow numbers and the '+' character
                    handleChange('mobileNumber', numericText)
                  }}
                  left={<TextInput.Icon icon={'phone'} />}
                />

                {formErrors.mobileNumber && (
                  <Text
                    style={[poppins.regular.h8, { color: "red" }]}
                  >{formErrors.mobileNumber}</Text>
                )}
                {/* Email */}
                <TextInput
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  style={styles.input}
                  mode="outlined"
                  value={formValues.email}
                  onChangeText={text => handleChange('email', text)}
                  left={<TextInput.Icon icon={'email'} />}
                />

                {formErrors.email && (
                  <Text
                    style={[poppins.regular.h8, { color: "red" }]}
                  >{formErrors.email}</Text>
                )}
                {/* Date of Birth */}
                <TouchableWithoutFeedback
                // onPress={openDatePicker}
                >
                  <TextInput
                    disabled={true}
                    placeholder="Date of Birth"
                    mode="outlined"
                    value={formValues.dateOfBirth}
                    left={<TextInput.Icon icon={'calendar'} />}
                    style={styles.input}
                  />
                </TouchableWithoutFeedback>
                <TextInput
                  // multiline={true}
                  placeholder={t('bio')}
                  style={[
                    styles.inputBio,
                    {
                      verticalAlign: 'middle',
                      paddingVertical: hp(1.5), // Adjust vertical padding as needed
                      textAlignVertical: 'center', // Center placeholder vertically (for multiline TextInput)
                    }
                  ]}
                  mode="outlined"
                  inputMode="text"
                  value={formValues?.bio}
                  onChangeText={text => handleChange('bio', text)}
                  left={<TextInput.Icon icon={'bio'} style={{ marginTop: wp(7) }} />}
                />
                {/* Social Media Inputs */}
                {/* Instagram */}
                <TextInput
                  placeholder="thundersgym"
                  style={[styles.input, { marginBottom: wp(2) }]}
                  mode="outlined"
                  inputMode="text"
                  value={formValues.instagram}
                  onChangeText={text => handleChange('instagram', text)}
                  left={<TextInput.Icon icon={'instagram'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary, marginTop: wp(0) }}>
                  {t('instagram_notes')}
                </Text>

                {/* <TextInput

                  placeholder="thundersgym"
                  style={styles.input}
                  mode="outlined"
                  inputMode="text"
                  value={formValues.facebook}
                  onChangeText={text => handleChange('facebook', text)}
                  left={<TextInput.Icon icon={'facebook'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary }}>
                  {t('facebook_notes')}
                </Text> */}
                {/* YouTube */}
                {/* <TextInput

                  placeholder="@thundersgym"
                  style={styles.input}
                  mode="outlined"
                  inputMode="text"
                  value={formValues.youtube}
                  onChangeText={text => handleChange('youtube', text)}
                  left={<TextInput.Icon icon={'youtube'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary }}>
                  {t('youtube_notes')}
                </Text> */}
                {/* <TextInput
            
            placeholder="thundersgym"
            style={styles.input}
            mode="outlined"
            inputMode="text"
            value={formValues.tiktok}
            onChangeText={text => handleChange('tiktok', text)}
            left={<IonicIcon name="logo-tiktok" color={"black"} size={20} />}
          /> */}
                {/* Pinterest */}
                {/* <TextInput

                  placeholder="thundersgym"
                  style={styles.input}
                  mode="outlined"
                  inputMode="text"
                  value={formValues.pinterest}
                  onChangeText={text => handleChange('pinterest', text)}
                  left={<TextInput.Icon icon={'pinterest'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary }}>
                  {t('pinterest_notes')}
                </Text> */}
                {/* Twitter */}
                <TextInput

                  placeholder="thundersgym"
                  style={[styles.input, { marginBottom: wp(2) }]}

                  mode="outlined"
                  inputMode="text"
                  value={formValues.twitter}
                  onChangeText={text => handleChange('twitter', text)}
                  left={<TextInput.Icon icon={'twitter'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary, marginTop: wp(0) }}>

                  {t('twitter_notes')}
                </Text>

                {/* snap */}
                <TextInput
                  placeholder="thundersgym"
                  style={[styles.input, { marginBottom: wp(2) }]}
                  mode="outlined"
                  inputMode="text"
                  value={formValues.snap}
                  onChangeText={text => handleChange('snap', text)}
                  left={<TextInput.Icon icon={'snapchat'} />}
                />
                <Text style={{ color: COLORS[theme].textPrimary, marginTop: wp(0) }}>

                  {t('snap_notes')}
                </Text>
              </View>
              <View style={{ width: wp(100), justifyContent: "center", alignSelf: "center", marginBottom: wp(2) }}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isLoading}
                  labelStyle={[
                    poppins.bold.h8,
                    { color: COLORS[theme].buttonText },
                  ]}
                  style={{
                    // Align the button to the left
                    width: wp(94),         // Set button width as you have already
                    height: hp(6),         // Set button height as you have already
                    marginHorizontal: wp(3), // Keep margin for left and right padding
                    marginBottom: wp(3),    // Add margin from the bottom if needed
                    marginTop: wp(1),    // Add margin from the bottom if needed
                    alignItems: "center",  // Ensure button content is centered
                    justifyContent: 'center',  // Ensure content inside the button is centered
                    backgroundColor: COLORS[theme].buttonBg,
                  }}
                >
                  {t('save_changes')}
                </Button>
              </View>

            </ScrollView>
          </>
      }
      <FlashMessage position="top" />
      <DatePickerModal
        mode="single"
        visible={open}
        date={date}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
        locale="en"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: wp(90),
    height: hp(6),
    marginVertical: wp(4),
  },
  inputTextArea: {
    width: wp(90),
    height: hp(8),
    marginVertical: wp(4),
  },
  header: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? hp(2) : hp(1), // Adjust for iOS and Android
    paddingHorizontal: wp(4),
    alignItems: 'center',
    marginVertical: wp(2)
  },
  inputBio: {
    // paddingTop: wp(8),// Adjust to vertically center the placeholder and text
    // paddingLeft: wp(2),// Adjust to horizontally align text
    // paddingRight: wp(2),// You can add some right padding too for better appearance
    // textAlignVertical: "center" // Align text at the top for multiline inputs
  },
});

export default EditProfileScreen;
