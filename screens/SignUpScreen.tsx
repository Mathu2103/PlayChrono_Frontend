import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
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
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join PlayChrono today</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                    />
                    <Input
                        label="University Email"
                        placeholder="john@university.edu"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <Button
                        title="Sign Up"
                        onPress={() => navigation.navigate('SignIn')}
                        style={styles.signUpButton}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signInLink}>Sign In</Text>
                    </TouchableOpacity>
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
    },
    backButtonText: {
        fontSize: 24,
        color: COLORS.text,
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
    signUpButton: {
        height: 56,
        borderRadius: RADIUS.l,
        marginTop: SPACING.m,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: SPACING.xs,
        paddingBottom: SPACING.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    signInLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 16,
    },
});
