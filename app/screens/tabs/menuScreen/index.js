
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { hp, wp } from '../../../resources/dimensions';
import { Icon } from 'react-native-paper';
import { poppins } from '../../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import { useAuthHoc } from '../../../config/config';
import { COLORS } from '../../../resources/colors';
import { useTheme } from '../../../context/ThemeContext';
import ToggleTheme from '../../../components/ToggleTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToggleLang from '../../../components/ToggleLang';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
const LogoutSection = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation(); // Initialize translation hook
  return (
    <View
      style={[
        { backgroundColor: COLORS[theme].viewBackground },
      ]}>
      <TouchableOpacity
        onPress={() => {
          // Show an alert with translated texts
          Alert.alert(
            t('confirm_logout'), // Translates 'Confirm Logout' text
            t('are_you_sure_logout'), // Translates 'Are you sure you want to log out?' text
            [
              {
                text: t('cancel'), // Assuming you have a translation key for 'Cancel'
                // onPress: () => console.log('Logout cancelled'),
                style: 'cancel',
              },
              {
                text: t('yes_Logout'), // Assuming you have a translation key for 'Yes, Logout'
                onPress: () => {
                  AsyncStorage.clear(); // Clear stored data
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'login-screen' }],
                  });
                },
              },
            ],
            { cancelable: true },
          );
        }}
        style={{
          flexDirection: 'row',
          paddingVertical: wp(2),
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: wp(4),
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: wp(2),
            alignItems: 'center',
            marginStart: wp(8),
            gap: wp(4),
          }}>
          <MaterialIcon
            name="logout"
            size={wp(5)}
            color={COLORS[theme].textPrimary}
          />
          <Text
            style={[
              poppins.medium.h7,
              {
                color: COLORS[theme].textPrimary,
              },
            ]}>
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


const ThemeSection = () => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: COLORS[theme].viewBackground },
        // commonStyles[theme].shadow,
      ]}>
      <View
        onPress={() => { }}
        style={{
          flexDirection: 'row',
          paddingVertical: wp(4),
          paddingEnd: wp(4),
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: wp(4),
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: wp(2),
            alignItems: 'center',
            marginStart: wp(8),
            gap: wp(4),
          }}>
          <MaterialCommunityIcon
            name={'theme-light-dark'}
            size={wp(5)}
            color={COLORS[theme].textPrimary}
          />
          <Text
            style={[
              poppins.medium.h7,
              {
                color: COLORS[theme].textPrimary,
              },
            ]}>
            {t('dark_mode')}
          </Text>
        </View>

        <ToggleTheme />
      </View>
    </View>
  );
};
const LangSection = () => {
  const { theme } = useTheme();

  const [isSwitchOn1, setisSwitchOn1] = useState(0);
  const onToggleSwitch1 = () => {
    if (isSwitchOn1 == 0) { setisSwitchOn1(1) } else
      setisSwitchOn1(0);
  }
  return (
    <View
      style={[
        { backgroundColor: COLORS[theme].viewBackground },
        // commonStyles[theme].shadow,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: wp(4),
          paddingEnd: wp(4),
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: wp(3.5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: wp(2),
            alignItems: 'center',
            marginStart: wp(8),
            gap: wp(3.5),
          }}>
          <MaterialCommunityIcon
            name={'language-lua'}
            size={wp(6)}
            color={COLORS[theme].textPrimary}
          />
          <Text
            style={[
              poppins.medium.h7,
              {
                color: COLORS[theme].textPrimary,
                textTransform: "capitalize"
              },
            ]}>
            {t('language')}

          </Text>
        </View>

        <ToggleLang Icon1={'format-letter-case'} Icon2={'abjad-arabic'} lang={true} />
      </View>
    </View>
  );
};

function MoreScreen() {


  const { theme } = useTheme();
  const { t } = useTranslation();

  const [userData, setUserData] = React.useState({});
  const [setBadgeData, setSubscriptionsData] = React.useState(null);
  const [availVersion, setAvailVersion] = React.useState(null);

  const {
    actions: { APP_GET_USER_API_CALL },
  } = useAuthHoc();



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS[theme].background }}>
        <View
          style={{ gap: wp(2), marginHorizontal: wp(2), paddingVertical: hp(2), paddingBottom: hp(5) }}>
          <ThemeSection t={t} />
          <LangSection t={t} />
          <LogoutSection t={t} />
          <View
            style={[
              { backgroundColor: COLORS[theme].viewBackground },
              // commonStyles[theme].shadow,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: wp(2),
                paddingEnd: wp(4),
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: wp(3.5),
              }}>
              <View
                style={{
                  width: wp(80),
                  flexDirection: 'row',
                  paddingVertical: wp(2),
                  marginStart: wp(8),
                  gap: wp(3.5),
                  justifyContent: "space-between"
                }}>
                <View style={{
                  flexDirection: 'row',
                  gap: wp(3),
                }}>
                  <MaterialCommunityIcon
                    name={'information'}
                    size={wp(6)}
                    color={COLORS[theme].textPrimary}
                  />
                  <Text
                    style={[
                      poppins.medium.h7,
                      {
                        color: COLORS[theme].textPrimary,
                        textTransform: "capitalize"
                      },
                    ]}>
                    {t('version')}
                  </Text>
                </View>
                <Text
                  style={[
                    poppins.medium.h7,
                    {
                      color: COLORS[theme].textPrimary,
                      // textTransform: "capitalize"
                    },
                  ]}>
                  {/* {`(v.${VersionCheck?.getCurrentVersion()})`} */}
                  {`(v.${availVersion})`}

                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
export default MoreScreen;
