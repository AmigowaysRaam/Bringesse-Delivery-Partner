import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../resources/colors';
import { wp } from '../resources/dimensions';
import { poppins } from '../resources/fonts';

const UserToggleStatus = () => {
    const [isOnline, setIsOnline] = useState(false);
    const { theme } = useTheme();
    const { t } = useTranslation();

    const toggleSwitch = () => setIsOnline(prev => !prev);

    const onlineText = t('userStatus.online') || 'Online';
    const offlineText = t('userStatus.offline') || 'Offline';

    return (
        <View style={[styles.card, {
            backgroundColor: COLORS[theme].background,
            borderColor: 'grey',
        }]}>
            <Text style={[poppins.semi_bold.h7, styles.statusText, { color: COLORS[theme].primary }]}>
                {isOnline ? onlineText : offlineText}
            </Text>
            <Switch
                trackColor={{ false: "#999", true: COLORS[theme].accent + '50' }}
                thumbColor={isOnline ? COLORS[theme].accent : COLORS[theme].white}
                onValueChange={toggleSwitch}
                value={isOnline}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: wp(4),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: wp(0.2),borderColor: '#CCC',
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Android shadow
    },
 
});

export default UserToggleStatus;
