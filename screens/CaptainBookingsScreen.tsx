import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export const CaptainBookingsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { user } = useUser();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const MOCK_BOOKINGS = [
        {
            id: '1', sport: 'football', ground: 'Central Ground', location: 'University',
            event: 'Practice Match', date: '2024-12-20', time: '08:00 - 10:00',
            color: COLORS.primary, icon: 'football', status: 'CONFIRMED'
        },
        {
            id: '2', sport: 'cricket', ground: 'North Arena', location: 'University',
            event: 'Tournament', date: '2024-12-21', time: '14:00 - 18:00',
            color: COLORS.secondary, icon: 'baseball', status: 'UPCOMING'
        }
    ];

    const fetchMyBookings = async () => {
        setLoading(true);
        setTimeout(() => {
            setBookings(MOCK_BOOKINGS);
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        if (isFocused) {
            fetchMyBookings();
        }
    }, [isFocused, user?.uid]);


    const renderBookingCard = ({ item }: { item: any }) => (
        <View style={styles.cardContainer}>
            {/* Colored Left Border */}
            <View style={[styles.leftBorder, { backgroundColor: item.color }]} />

            <View style={styles.cardContent}>
                {/* Top Section */}
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                            <Ionicons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.groundName}>{item.ground}</Text>
                            <Text style={styles.eventText}>{item.event}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bottom Section */}
                <View style={styles.cardFooter}>
                    <View style={styles.dateTimeContainer}>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{item.date}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{item.time}</Text>
                        </View>
                    </View>

                    <View style={[styles.statusBadge, item.status === 'COMPLETED' && styles.statusBadgeCompleted]}>
                        <Text style={[styles.statusText, item.status === 'COMPLETED' && styles.statusTextCompleted]}>{item.status}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Schedule')}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: COLORS.textSecondary }}>No bookings found</Text>
                        </View>
                    }
                />
            )}
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
    listContainer: {
        padding: SPACING.m,
        paddingBottom: 80,
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        marginBottom: SPACING.m,
        overflow: 'hidden',
        ...SHADOWS.card,
    },
    leftBorder: {
        width: 6,
    },
    cardContent: {
        flex: 1,
        padding: SPACING.m,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    groundName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    eventText: {
        fontSize: 14,
        color: COLORS.primary, // Theme primary color
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.m,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dateTimeContainer: {
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: RADIUS.s,
    },
    statusText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadgeCompleted: {
        backgroundColor: '#F5F5F5',
    },
    statusTextCompleted: {
        color: '#757575',
    },
});
