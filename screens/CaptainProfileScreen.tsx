import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';

export const CaptainProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, setUser } = useUser();

    // Local state for form fields
    const [name, setName] = useState(user?.username || '');
    const [sport, setSport] = useState(user?.sportType || '');
    const [team, setTeam] = useState(user?.teamName || '');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state if user context updates
    useEffect(() => {
        if (user) {
            setName(user.username);
            setSport(user.sportType || '');
            setTeam(user.teamName || '');
            if (user.profileImage) setProfileImage(user.profileImage);
        }
    }, [user]);

    const hasChanges =
        name !== user?.username ||
        sport !== user?.sportType ||
        team !== user?.teamName ||
        profileImage !== null;

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2, // Low quality to fit in Firestore
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            // Create a data URI for display and upload
            const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfileImage(uri);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!user) {
            Alert.alert("Session Expired", "Please log out and log in again.");
            return;
        }
        if (!name.trim()) {
            Alert.alert('Invalid Input', 'Name cannot be empty.');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Mock Update
            const updatedUser = {
                ...user,
                username: name,
                sportType: sport,
                teamName: team,
                profileImage: profileImage || undefined
            };

            setUser(updatedUser);

            Alert.alert('Success', 'Profile updated successfully! (Demo Mode)', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Profile Picture Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{name ? name.substring(0, 2).toUpperCase() : 'U'}</Text>
                        )}
                        <View style={styles.cameraButton}>
                            <Ionicons name="camera" size={16} color={COLORS.surface} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
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
                                value={user?.email || ''}
                                editable={false}
                                placeholder="Email Address"
                            />
                            <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
                        </View>
                        <Text style={styles.helperText}>Email cannot be changed.</Text>
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
                                placeholder="Sport (e.g. Football)"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>
                    </View>

                    {/* Team Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Team Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="people-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={team}
                                onChangeText={setTeam}
                                placeholder="Team Name"
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
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
        position: 'relative',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
        backgroundColor: COLORS.primary,
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
        backgroundColor: COLORS.primary,
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
