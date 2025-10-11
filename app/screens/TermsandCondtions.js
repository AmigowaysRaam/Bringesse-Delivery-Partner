import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderBar from '../components/header';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import { poppins } from '../resources/fonts';

const TermsAndConditions = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const terms = [
    {
      title: '1. Acceptance of Terms',
      content:
        'By joining as a delivery partner, you agree to comply with all company policies, including punctuality, professionalism, and safe driving practices.',
    },
    {
      title: '2. Partner Responsibilities',
      content:
        'You must ensure timely deliveries, handle orders carefully, and maintain polite communication with customers and merchants.',
    },
    {
      title: '3. Payment Terms',
      content:
        'Payments will be made weekly/monthly based on completed deliveries. Deductions may apply for penalties or policy violations.',
    },
    {
      title: '4. Conduct & Ethics',
      content:
        'Any abusive behavior, misconduct, or fraudulent activity will lead to account suspension or termination.',
    },
    {
      title: '5. Safety Guidelines',
      content:
        'Helmets and safety gear must be worn while delivering. Follow all traffic rules and prioritize safety at all times.',
    },
    {
      title: '6. Account Suspension',
      content:
        'Violation of company policies may result in temporary or permanent suspension without prior notice.',
    },
    {
      title: '7. Data Privacy',
      content:
        'Personal data will be used only for operational and legal compliance purposes, in accordance with our privacy policy.',
    },
    {
      title: '8. Modifications',
      content:
        'These terms may be updated periodically. Continued use of the platform implies acceptance of the latest terms.',
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS[theme].background }}>
      <HeaderBar title={t('Terms and Conditions')} showBackArrow />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {terms.map((item, index) => (
          <View key={index} style={styles.termContainer}>
            <Text style={[styles.termTitle, { color: COLORS[theme].textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.termContent, { color: COLORS[theme].textPrimary ,lineHeight:wp(5)}]}>
              {item.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
  termContainer: {
    marginBottom: hp(3),
  },
  termTitle: {
    ...poppins.semi_bold.h6,
    marginBottom: hp(1),
  },
  termContent: {
    ...poppins.regular.h7,
    lineHeight: hp(2.5),
  },
});

export default TermsAndConditions;
