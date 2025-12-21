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
import { API_BASE_URL } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [role, setRole] = useState<'Student' | 'Captain'>('Student');



    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [sportName, setSportName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    username: fullName,
                    role: role.toLowerCase(),
                    sportType: role === 'Captain' ? sportName : undefined,
                    teamName: role === 'Captain' ? teamName : undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Account created successfully", [
                    { text: "OK", onPress: () => navigation.navigate('SignIn') }
                ]);
            } else {
                Alert.alert("Error", data.error || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network request failed. Check Backend.");
        }
    };

    const isPasswordStrong = password.length >= 8 && confirmPassword === password && password !== '';

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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join PlayChrono today</Text>
                    </View>
                </View>

                {/* Role Selection */}
                <View style={styles.roleSelectorContainer}>
                    <TouchableOpacity
                        style={[styles.roleTab, role === 'Student' && styles.activeRoleTab]}
                        onPress={() => setRole('Student')}
                    >
                        <Text style={[styles.roleTabText, role === 'Student' && styles.activeRoleTabText]}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleTab, role === 'Captain' && styles.activeRoleTab]}
                        onPress={() => setRole('Captain')}
                    >
                        <Text style={[styles.roleTabText, role === 'Captain' && styles.activeRoleTabText]}>Captain</Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <Input
                        label="University Email"
                        placeholder="john@university.edu"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {role === 'Captain' && (
                        <>
                            <Input
                                label="Sport Name"
                                placeholder="e.g. Football"
                                value={sportName}
                                onChangeText={setSportName}
                            />
                            <Input
                                label="Team Name"
                                placeholder="e.g. The Tigers"
                                value={teamName}
                                onChangeText={setTeamName}
                            />
                        </>
                    )}
                    <View style={styles.passwordInputContainer}>
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            containerStyle={{ marginBottom: 0 }}
                        />
                        {isPasswordStrong && (
                            <Text style={styles.passwordStatusInner}>Strong Password</Text>
                        )}
                    </View>
                    <View style={styles.passwordInputContainer}>
                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            containerStyle={{ marginBottom: 0 }}
                            rightIcon={showConfirmPassword ? "eye" : "eye-off"}
                            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                        {isPasswordStrong && (
                            <Text style={styles.passwordStatusInner}>Strong Password</Text>
                        )}
                    </View>



                    <Button
                        title="Sign Up"
                        onPress={handleSignUp}
                        style={styles.signUpButton}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? <Text style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>Sign In</Text></Text>
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
        marginBottom: SPACING.l,
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
    roleSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.l,
    },
    roleTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: RADIUS.m - 2,
    },
    activeRoleTab: {
        backgroundColor: COLORS.primary,
    },
    roleTabText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    activeRoleTabText: {
        color: COLORS.surface,
    },
    form: {
        flex: 1,
    },
    passwordInputContainer: {
        position: 'relative',
        marginBottom: SPACING.m,
    },
    passwordStatusInner: {
        position: 'absolute',
        right: SPACING.m,
        top: 42, // Adjusted to be inside the input area
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },

    signUpButton: {
        height: 56,
        borderRadius: RADIUS.m,
        marginTop: SPACING.m,
        backgroundColor: COLORS.primary,
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
    signInLink: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});
