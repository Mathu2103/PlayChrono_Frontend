// ... imports remain the same
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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
    type: 'booking'; // discriminator
}

interface TextNotice {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    createdBy: { name: string };
    type: 'notice';
}

type FeedItem = BookingNotice | TextNotice;

export const NoticesListScreen: React.FC<Props> = ({ navigation }) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            // Fetch Bookings and Notices in parallel
            const [bookingsRes, noticesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/bookings/today`),
                fetch(`${API_BASE_URL}/api/notices`)
            ]);

            const bookingsData = await bookingsRes.json();
            const noticesData = await noticesRes.json();

            let items: FeedItem[] = [];

            // Process Notices
            if (noticesData.success && noticesData.notices) {
                const notices = noticesData.notices.map((n: any) => ({ ...n, type: 'notice' }));
                items = [...items, ...notices];
            }

            // Process Bookings
            if (bookingsData.success && bookingsData.bookings) {
                const bookings = bookingsData.bookings.map((b: any) => ({ ...b, type: 'booking' }));
                items = [...items, ...bookings];
            }

            setFeedItems(items);

        } catch (error) {
            console.error("Network error fetching feed:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderNoticeCard = (item: TextNotice) => (
        <View key={item.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
                <View style={styles.noticeIconContainer}>
                    <Ionicons name="megaphone" size={20} color="#fff" />
                </View>
                <View style={styles.noticeHeaderText}>
                    <Text style={styles.noticeTitle}>{item.title}</Text>
                    <Text style={styles.noticeDate}>{new Date(item.createdAt).toDateString()}</Text>
                </View>
            </View>
            <Text style={styles.noticeMessage}>{item.message}</Text>
            <Text style={styles.noticeAuthor}>- {item.createdBy?.name || 'Admin'}</Text>
        </View>
    );

    const renderBookingCard = (item: BookingNotice) => (
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
    );

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
                <View style={styles.headerSpacer} />
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.listContainer}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {feedItems.length > 0 ? (
                        feedItems.map((item) => {
                            if (item.type === 'notice') return renderNoticeCard(item as TextNotice);
                            return renderBookingCard(item as BookingNotice);
                        })
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={64} color={COLORS.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <Text style={styles.emptyText}>No updates for today.</Text>
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
        marginRight: SPACING.s,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerSpacer: { width: 40 },
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    // Schedule Card Styles (Existing)
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
    // Notice Card Styles (New)
    noticeCard: {
        backgroundColor: '#FFFDE7', // Light yellow background for announcements
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderLeftWidth: 4,
        borderLeftColor: '#FBC02D', // Strong yellow accent
        ...SHADOWS.card,
    },
    noticeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    noticeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    noticeHeaderText: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    noticeDate: {
        fontSize: 12,
        color: '#666',
    },
    noticeMessage: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 8,
    },
    noticeAuthor: {
        textAlign: 'right',
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
    },
});
