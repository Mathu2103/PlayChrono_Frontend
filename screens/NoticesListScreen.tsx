import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticesList'>;

interface BookingNotice {
    bookingId: string;
    groundName: string;
    timeSlots: string;
    purpose: string;
    captainName: string;
    teamName: string;
}

export const NoticesListScreen: React.FC<Props> = ({ navigation }) => {
    const [notices, setNotices] = useState<BookingNotice[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/bookings/today`);
            const data = await response.json();

            if (data.success) {
                setNotices(data.bookings);
            } else {
                console.error("Failed to fetch notices:", data.error);
            }
        } catch (error) {
            console.error("Network error fetching notices:", error);
            Alert.alert("Error", "Could not fetch today's schedule.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    })}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Daily Scoop</Text>
                    <Text style={styles.subtitle}>{new Date().toDateString()}</Text>
                </View>
                {/* Spacer to balance the back button */}
                <View style={styles.headerSpacer} />
            </View>

            {/* Schedule List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.listContainer}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {notices.length > 0 ? (
                        notices.map((item) => (
                            <View key={item.bookingId} style={styles.scheduleCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.groundName}>{item.groundName}</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Booked</Text>
                                    </View>
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                        <Text style={styles.infoText}>{item.timeSlots}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="football-outline" size={20} color={COLORS.textSecondary} />
                                        <Text style={styles.infoText}>{item.purpose}</Text>
                                    </View>
                                    {item.teamName && (
                                        <View style={styles.infoRow}>
                                            <Ionicons name="people-outline" size={20} color={COLORS.textSecondary} />
                                            <Text style={styles.infoText}>{item.teamName}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={64} color={COLORS.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <Text style={styles.emptyText}>No bookings scheduled for today.</Text>
                            <Text style={styles.emptySubText}>Check back tomorrow!</Text>
                        </View>
                    )}
                </ScrollView>
            )}
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
        marginRight: SPACING.s, // Reduced margin
        zIndex: 1, // Ensure back button is clickable
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerSpacer: {
        width: 40, // Same width as backButton
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    listContainer: {
        flex: 1,
        padding: SPACING.m,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    scheduleCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.card,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
        paddingBottom: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    groundName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    statusBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    cardBody: {
        gap: SPACING.s,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    infoText: {
        fontSize: 15,
        color: COLORS.text,
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    emptySubText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
