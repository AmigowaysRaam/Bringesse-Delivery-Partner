import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Linking, BackHandler ,Image} from 'react-native';
import { IMAGE_ASSETS } from '../../resources/images';
import { hp, wp } from '../../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
import { getUserData, getLangData } from '../../utils/utils';
import { useTheme } from '../../context/ThemeContext';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { useAuthHoc } from '../../config/config';
var _ = require('lodash');

export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    actions: { APP_REGISTER_OTP_LOGIN_API_CALL },
  } = useAuthHoc();

  const [network, setNetwork] = React.useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setNetwork(false);
        // openNetworkSettings();
      } else {
        setNetwork(true);
      }
    });
    return unsubscribe;
  }, []);


  useEffect(() => {
    fetchUserData();
    
    // Only redirect if network is available
    if (network) {
      setTimeout(() => {
        redirectScreen();
      }, 2000);
    }
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
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'login-screen' }],
      //   animation: 'none',
      // });
      navigation.reset({
        index: 0,
        routes: [{ name: 'GetStartedScreen' }],
        animation: 'none',
      });

      
  };
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Image
        // tintColor={COLORS[theme].textPrimary}
        style={[styles.splashLogo, ]}
        resizeMode="contain"
        source={IMAGE_ASSETS.splash_screen}
      />
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
    height: hp(100),
    width: wp(100),
    marginBottom: hp(4),
  },
});
