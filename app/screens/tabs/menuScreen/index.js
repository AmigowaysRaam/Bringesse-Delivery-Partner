import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { hp, wp } from '../../../resources/dimensions';
import { Icon } from 'react-native-paper';
import { poppins } from '../../../resources/fonts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../resources/colors';
import { useTheme } from '../../../context/ThemeContext';
import ToggleTheme from '../../../components/ToggleTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToggleLang from '../../../components/ToggleLang';
import { useTranslation } from 'react-i18next';
import UserProfileCard from '../../UserProfileCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../api/api';
import DeviceInfo from 'react-native-device-info';
// --- Logout Section ---
const LogoutSection = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleLogout = () => {
    Alert.alert(
      t('confirm_logout'),
      t('are_you_sure_logout'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('yes_Logout'),
          onPress: () => {
            AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'login-screen' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ backgroundColor: COLORS[theme].viewBackground }}>
      <TouchableOpacity onPress={handleLogout} style={sectionRow}>
        <View style={leftRow}>
          <MaterialIcon name="logout" size={wp(5)} color={COLORS[theme].textPrimary} />
          <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
            {t('Logout')}
          </Text>
        </View>
        <Icon
          source={'menu-right'}
          size={wp(8)}
          style={{ margin: wp(10) }}
          color={COLORS[theme].textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};
// --- Theme Toggle Section ---
const ThemeSection = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: COLORS[theme].viewBackground }}>
      <View style={sectionRow}>
        <View style={leftRow}>
          <MaterialCommunityIcon
            name="theme-light-dark"
            size={wp(5)}
            color={COLORS[theme].textPrimary}
          />
          <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
            {t('dark_mode')}
          </Text>
        </View>
        <ToggleTheme />
      </View>
    </View>
  );
};
   
// --- Language Toggle Section ---
const LangSection = () => {

  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: COLORS[theme].viewBackground }}>
      <View style={sectionRow}>
        <View style={leftRow}>
          <MaterialCommunityIcon
            name="google-translate"
            size={wp(6)}
            color={COLORS[theme].textPrimary}
          />
          <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
            {t('language')}
          </Text>
        </View>
        <ToggleLang Icon1="format-letter-case" Icon2="abjad-arabic" lang />
      </View>
    </View>
  );
};
// --- MoreScreen Main Component ---
const MoreScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [availVersion] = useState('1.0.0'); // or fetch from config or constants
  const profile = useSelector(state => state.Auth.profile);
  const navigation = useNavigation();
  const accessToken = useSelector(state => state.Auth.accessToken);
  const dispatch = useDispatch();
  
  useFocusEffect(
    useCallback(() => {
      const fetchProfileData = async () => {
          console.log('profile'," JSON.stringify(data)");
        if (!accessToken || !profile?.driver_id) return;
          console.log('profile', '2');

        try {
          const data = await fetchData('profile/'+ profile?.driver_id, 'GET', null, {
            Authorization: `${accessToken}`,
            driver_id: profile.driver_id,
            // device_id: deviceId,
          });
          // console.log('profile', JSON.stringify(data));
          dispatch({
            type: 'PROFILE_DETAILS',
            payload: data,
          });
        } catch (error) {
          console.error('profile API Error:', error);
        } finally {
          // setLoading(false);
        }
      };
      fetchProfileData();
    }, [])
  );

  const SectionItem = ({ icon, label ,navigationPath}) => (
    <TouchableOpacity onPress={()=>navigation?.navigate(navigationPath)} style={{ backgroundColor: COLORS[theme].viewBackground }}>
      <View style={sectionRow}>
        <View style={leftRow}>
          <MaterialCommunityIcon
            name={icon}
            size={wp(6)}
            color={COLORS[theme].textPrimary}
          />
          <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
            {t(label)}
          </Text>
        </View>
        <Icon
          source={'menu-right'}
          size={wp(8)}
          style={{ margin: wp(10) }}
          color={COLORS[theme].textPrimary}
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: COLORS[theme].background }}>
        {/* User Profile (Fixed at Top) */}
        <UserProfileCard profile={profile} />
        {/* Scrollable Settings */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingVertical: hp(2),
            paddingBottom: hp(5),
            gap: wp(2),
            marginHorizontal: wp(2),
          }}>
          <SectionItem icon="face-man-profile" label="personal_info"  navigationPath='PersonalInfoScreen' navigation={navigation} />
          <SectionItem icon="wallet" label="wallet_history" navigationPath='WalletHistory' navigation={navigation} />
          <SectionItem icon="archive-star"  navigation={navigation} label="reviews"  navigationPath='PersonalInfoScreen' />
          <ThemeSection />
          <LangSection />
          <LogoutSection />

          {/* App Version Info */}
          <View style={{ backgroundColor: COLORS[theme].viewBackground }}>
            <View style={sectionRow}>
              <View style={[leftRow, { justifyContent: 'space-between', width: wp(80) }]}>
                <View style={{ flexDirection: 'row', gap: wp(3) }}>
                  <MaterialCommunityIcon
                    name="information"
                    size={wp(6)}
                    color={COLORS[theme].textPrimary}
                  />
                  <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
                    {t('version')}
                  </Text>
                </View>
                <Text style={[poppins.medium.h7, { color: COLORS[theme].textPrimary }]}>
                  {`(v.${availVersion})`}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

// --- Common Styles ---
const sectionRow = {
  flexDirection: 'row',
  paddingVertical: wp(4),
  paddingEnd: wp(4),
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: wp(3.5),
};

const leftRow = {
  flexDirection: 'row',
  alignItems: 'center',
  marginStart: wp(8),
  gap: wp(4),
};

export default MoreScreen;
