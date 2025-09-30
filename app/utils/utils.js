import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserData() {
  return await AsyncStorage.getItem('user_data');
}

export async function getLangData() {
  return await AsyncStorage.getItem("lang_data");
}

