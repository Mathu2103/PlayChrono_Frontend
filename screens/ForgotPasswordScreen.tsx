import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

import { useRoute, RouteProp } from '@react-navigation/native';

// ...

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const route = useRoute<RouteProp<RootStackParamList, 'ForgotPassword'>>();
    const initialEmail = route.params?.email || '';
    const [email, setEmail] = useState(initialEmail);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }

        try {
            // 1. Verify email exists in OUR database first
            const checkResponse = await fetch(`${API_BASE_URL}/api/users/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (checkResponse.status === 404) {
                // Explicitly block if email not found in backend
                Alert.alert("Error", "This email is not registered with us. Please use the email you signed up with.");
                return;
            }

            // 2. Only if backend confirms, trigger Firebase Reset
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                "Reset Link Sent",
                "If an account exists for this email, you will receive a password reset link shortly.",
                [
                    { text: "OK", onPress: () => navigation.navigate('SignIn') }
                ]
            );
        } catch (error: any) {
            let errorMessage = "Something went wrong. Please try again.";

            if (error.code === 'auth/user-not-found') {
                errorMessage = "This email is not registered with us. Please use the email you signed up with.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address.";
            } else {
                errorMessage = error.message || errorMessage;
            }

            Alert.alert("Error", errorMessage);
        }
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
