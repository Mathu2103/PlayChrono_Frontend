import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const CaptainProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Schedule')}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Profile Picture Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder for Image - In real app, use Image component */}
                        <Text style={styles.avatarText}>CA</Text>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Ionicons name="camera" size={16} color={COLORS.surface} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.formCard}>
                    {/* Username */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value="Captain Alex"
                                placeholder="Username"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value="password123"
                                secureTextEntry={!passwordVisible}
                                placeholder="Password"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>Password must be at least 8 characters.</Text>
                    </View>

                    {/* Team Affiliation */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Team Affiliation</Text>
                        <View style={[styles.inputContainer, styles.disabledInput]}>
                            <Ionicons name="people" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value="The Tigers"
                                editable={false}
                                placeholder="Team"
                            />
                            <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton}>
                    <Ionicons name="save-outline" size={20} color={COLORS.surface} style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F4F6F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    container: {
        padding: SPACING.l,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary, // Using theme primary color
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
        position: 'relative',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.surface,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary, // Using theme primary color
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.surface,
    },
    changePhotoText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.l,
        marginBottom: SPACING.xl,
        ...SHADOWS.card,
    },
    inputGroup: {
        marginBottom: SPACING.l,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7F9',
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        height: 50,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    disabledInput: {
        backgroundColor: '#F0F0F0',
        opacity: 0.8,
    },
    helperText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: COLORS.primary, // Using theme primary color
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: RADIUS.m,
        ...SHADOWS.card,
    },
    saveButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
