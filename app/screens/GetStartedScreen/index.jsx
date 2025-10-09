import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { IMAGE_ASSETS } from '../../resources/images';
import { hp, wp } from '../../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { useAuthHoc } from '../../config/config';
import { COLORS } from '../../resources/colors';
import { useTheme } from '../../context/ThemeContext';
import { poppins } from '../../resources/fonts';
var _ = require('lodash');

export default function GetStartedScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    actions: { APP_REGISTER_OTP_LOGIN_API_CALL },
  } = useAuthHoc();

  const [network, setNetwork] = React.useState(false);
  useEffect(() => {
    fetchUserData();
  }, [network]);

  const fetchUserData = async () => {
    const userData = await getUserData();
    if (userData && !_.isEmpty(userData)) {
      const obj = JSON.parse(userData);
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: obj.data.user_data,
      });
    }
  };
  const redirectScreen = async () => {
    navigation?.navigate('login-screen')
    // navigation.navigate({
    //   index: 0,
    //   routes: [{ name: 'login-screen' }],
    //   animation: 'none',
    // });
  };
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
     <View>
     <Image
        style={styles.splashLogo}
        resizeMode="contain"
        source={IMAGE_ASSETS.delivery_boy_image}
      />
      <View>
      <Text style={[poppins.regular.h5,styles.buttonText,{
          color:COLORS[theme].primary
        }]}>Super Fast On-Time Delivery</Text>
          <Text  style={[poppins.regular.h8,styles.buttonText,{
          color:COLORS[theme].primary,maxWidth:wp(70),textAlign:"center",marginTop:hp(1.5)
        }]}>Get your Favourite delivered at your doorstep within minutes</Text>
      </View>
     </View>
      <TouchableOpacity style={[styles.getStartedButton,{
        backgroundColor: COLORS[theme].accent
      }]} onPress={redirectScreen}>
        <Text style={[poppins.semi_bold.h6,styles.buttonText,{
          color:COLORS[theme].white
        }]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    height: hp(30),
    width: wp(50),
    alignSelf:'center',
  },
  getStartedButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    width: wp(80),position:"absolute",bottom:hp(3)
  },
  buttonText: {
  },
});
