import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../resources/colors';
import { hp, wp } from '../../../resources/dimensions';
import FlashMessage from 'react-native-flash-message';
import { IMAGE_ASSETS } from '../../../resources/images';
import UserToggleStatus from '../../UserToggleStatus';

const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location:', latitude, longitude);
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          Alert.alert('Location Error', error.message || 'Failed to get location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    };

    getLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // Permissions handled by Info.plist
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker coordinate={location}>
            <Image
              source={IMAGE_ASSETS?.scooter}
              style={{ width: wp(10), height: wp(10) }}
            // resizeMode="center"
            />
          </Marker>
        </MapView>
      )}
      <View style={{ position: 'absolute', bottom: hp(1), width: '100%' }}>
        <UserToggleStatus />
      </View>

      <FlashMessage position="top" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: wp(100),
    height: hp(100),
  },
});

export default HomeScreen;
