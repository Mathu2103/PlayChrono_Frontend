import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    icon?: string; // Placeholder for future icon support
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    onFocus,
    onBlur,
    rightIcon,
    onRightIconPress,
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
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
                        <Ionicons name={rightIcon} size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
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
        paddingRight: SPACING.s,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: SPACING.m,
        fontSize: 16,
        color: COLORS.text,
    },
    rightIcon: {
        padding: SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
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
