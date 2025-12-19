import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, NoticeSport, NoticePriority } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateNotice'>;

// This would come from auth context in real app
const MOCK_USER = {
    role: 'Admin' as 'Admin' | 'Captain',
    sport: 'Cricket' as NoticeSport, // Only relevant if Captain
};

export const CreateNoticeScreen: React.FC<Props> = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<NoticePriority>('General');
    const [targetAudience, setTargetAudience] = useState<NoticeSport>(
        MOCK_USER.role === 'Captain' ? MOCK_USER.sport : 'All'
    );

    const priorities: NoticePriority[] = ['General', 'Important', 'Urgent'];
    const sports: NoticeSport[] = ['All', 'Cricket', 'Football', 'Basketball', 'Badminton'];

    const handleSubmit = () => {
        // Validate
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        // In real app, make API call here
        console.log('Creating notice:', { title, message, priority, targetAudience });
        
        // Navigate back
        navigation.goBack();
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar style="dark" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Notice</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Notice Title"
                        placeholder="Enter notice title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.chipsContainer}>
                            {priorities.map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.chip,
                                        priority === p && styles.chipActive
                                    ]}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        priority === p && styles.chipTextActive
                                    ]}>
                                        {p}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Target Audience</Text>
                        {MOCK_USER.role === 'Captain' ? (
                            <View style={styles.lockedTarget}>
                                <Text style={styles.lockedTargetText}>
                                    Posting to: {MOCK_USER.sport} Team
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.chipsContainer}>
                                {sports.map((sport) => (
                                    <TouchableOpacity
                                        key={sport}
                                        style={[
                                            styles.chip,
                                            targetAudience === sport && styles.chipActive
                                        ]}
                                        onPress={() => setTargetAudience(sport)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            targetAudience === sport && styles.chipTextActive
                                        ]}>
                                            {sport}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message</Text>
                        <View style={styles.textAreaContainer}>
                            <Input
                                placeholder="Enter your message here..."
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={8}
                                style={styles.textArea}
                                containerStyle={styles.textAreaInputContainer}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            style={styles.cancelButton}
                        />
                        <Button
                            title="Post Notice"
                            onPress={handleSubmit}
                            style={styles.submitButton}
                        />
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    scrollContent: {
        padding: SPACING.m,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    chip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.xl,
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    chipTextActive: {
        color: COLORS.surface,
    },
    lockedTarget: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    lockedTargetText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
    },
    textAreaContainer: {
        flex: 1,
    },
    textAreaInputContainer: {
        marginBottom: 0,
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
        paddingTop: SPACING.m,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.l,
    },
    cancelButton: {
        flex: 1,
    },
    submitButton: {
        flex: 1,
    },
});
