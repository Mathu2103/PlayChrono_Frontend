import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        // Simulate API call
        setTimeout(() => {
            Alert.alert(
                "Reset Link Sent",
                "If an account exists for this email, you will receive a password reset link shortly.",
                [
                    { text: "OK", onPress: () => navigation.navigate('SignIn') }
                ]
            );
        }, 1000);
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>Enter your email to reset password</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Email Address"
                        placeholder="john@university.edu"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Button
                        title="Send Reset Link"
                        onPress={handleResetPassword}
                        style={styles.resetButton}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xl,
        marginTop: SPACING.m,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RADIUS.s,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitles: {
        gap: SPACING.xs,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    form: {
        flex: 1,
    },
    resetButton: {
        height: 56,
        borderRadius: RADIUS.m,
        marginTop: SPACING.m,
        backgroundColor: COLORS.primary,
    },
});
