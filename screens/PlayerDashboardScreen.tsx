import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerDashboard'>;

export const PlayerDashboardScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Player Dashboard</Text>
                <Text>Welcome to the Player Dashboard!</Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
