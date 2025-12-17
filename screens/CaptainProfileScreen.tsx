import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const CaptainProfileScreen: React.FC = () => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text>Profile & Settings</Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
