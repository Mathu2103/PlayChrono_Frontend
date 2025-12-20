import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export const SignInScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();

    const handleSignIn = async () => {
        // Mock Login for Demo
        Alert.alert("Demo Mode", "Logging in as Demo Captain (Backend Bypass)");

        setUser({
            uid: 'mock_captain_uid',
            email: email || 'captain@demo.com',
            username: 'Demo Captain',
            role: 'captain',
            sportType: 'Football',
            teamName: 'Dream Team',
            profileImage: undefined
        });

        navigation.reset({
            index: 0,
            routes: [{ name: 'CaptainDashboard' }],
        });
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
                        onPress={() => navigation.navigate('Welcome')}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>
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
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleSignIn}
                        style={styles.signInButton}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text></Text>
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.l,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    signInButton: {
        height: 56,
        borderRadius: RADIUS.m,
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    signUpLink: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});
