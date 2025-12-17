import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
    loading = false
}) => {
    const getBackgroundColor = () => {
        if (disabled) return COLORS.textSecondary;
        if (variant === 'primary') return COLORS.primary;
        if (variant === 'secondary') return COLORS.secondary;
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'outline') return COLORS.primary;
        if (variant === 'ghost') return COLORS.primary;
        if (variant === 'secondary') return COLORS.text;
        return COLORS.surface;
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: COLORS.primary };
        return {};
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
