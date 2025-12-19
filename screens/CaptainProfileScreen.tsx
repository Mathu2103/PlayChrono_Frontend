import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const CaptainProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    // Initial data - normally fetched from backend
    const initialData = {
        name: 'Captain Alex',
        sport: 'Badminton',
        email: 'alex@playchrono.com'
    };

    const [name, setName] = useState(initialData.name);
    const [sport, setSport] = useState(initialData.sport);
    const [email] = useState(initialData.email);
    const [isLoading, setIsLoading] = useState(false);

    // Check for changes
    const hasChanges = name !== initialData.name || sport !== initialData.sport;

    const handleSave = () => {
        // Validation
        if (!name.trim() || !sport.trim()) {
            Alert.alert('Invalid Input', 'Name and Sport cannot be empty.');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Success', 'Profile updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back or refresh state
                        // Since we are on the profile tab, staying here is appropriate.
                        // Ideally we would update the "initialData" to the new values here.
                    }
                }
            ]);
        }, 1500);
    };

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
                        <Text style={styles.avatarText}>{name.substring(0, 2).toUpperCase()}</Text>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Ionicons name="camera" size={16} color={COLORS.surface} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}>Edit Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.formCard}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Full Name"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>
                    </View>

                    {/* Email (Read Only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputContainer, styles.disabledInput]}>
                            <Ionicons name="mail" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                editable={false}
                                placeholder="Email Address"
                            />
                            <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
                        </View>
                    </View>

                    {/* Sport */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sport</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="trophy-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={sport}
                                onChangeText={setSport}
                                placeholder="Sport"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, (!hasChanges || isLoading) && { opacity: 0.5 }]}
                    onPress={handleSave}
                    disabled={!hasChanges || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={COLORS.surface} />
                    ) : (
                        <>
                            <Ionicons name="save-outline" size={20} color={COLORS.surface} style={{ marginRight: 8 }} />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </>
                    )}
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
