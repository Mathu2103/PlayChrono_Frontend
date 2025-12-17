import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    icon?: string; // Placeholder for future icon support
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                isFocused && styles.focusedInput,
                !!error && styles.errorInput
            ]}>
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={COLORS.textSecondary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        height: 56,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: SPACING.m,
        fontSize: 16,
        color: COLORS.text,
    },
    focusedInput: {
        borderColor: COLORS.primary,
        backgroundColor: '#F5F5FF', // Very light tint of primary
    },
    errorInput: {
        borderColor: COLORS.error,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
        marginTop: 4,
        marginLeft: SPACING.xs,
    },
});
