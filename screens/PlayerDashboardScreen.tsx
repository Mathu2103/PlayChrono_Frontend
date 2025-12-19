import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerDashboard'>;

export const PlayerDashboardScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Player Dashboard</Text>
                <Text style={styles.subtitle}>Welcome to the Player Dashboard!</Text>
                
                <View style={styles.buttonContainer}>
                    <Button 
                        title="View Notices"
                        onPress={() => navigation.navigate('NoticesList')}
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.l,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: SPACING.s,
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        gap: SPACING.m,
    },
    button: {
        width: '100%',
    },
});
