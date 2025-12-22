import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        // Added minHeight: 1 to help with some web overflow issues where flex: 1 alone doesn't trigger scroll
        minHeight: 1,
    },
});
