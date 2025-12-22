import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config';

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
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings/${user.uid}`);

            if (response.ok) {
                const data = await response.json();

                // Get today's date in YYYY-MM-DD format for comparison
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const currentDate = `${year}-${month}-${day}`;

                const mappedBookings = data.bookings.map((b: any) => {
                    let status = (b.status || 'CONFIRMED').toUpperCase();

                    // Check if date is passed
                    if (b.date < currentDate) {
                        status = 'DONE';
                    }

                    return {
                        id: b.bookingId || Math.random().toString(),
                        sport: b.sportType?.toLowerCase() || 'sports',
                        ground: b.groundName,
                        location: 'PlayChrono Ground',
                        event: b.purpose || 'Booking',
                        date: b.date,
                        time: b.selectedSlots?.join(', ') || 'Time N/A',
                        color: COLORS.primary,
                        icon: 'football',
                        status: status
                    };
                });

                // Sort bookings: Upcoming first (ascending date), then Done (descending date)
                mappedBookings.sort((a: any, b: any) => {
                    // If both are DONE or both are NOT DONE, sort by date
                    if ((a.status === 'DONE' && b.status === 'DONE') || (a.status !== 'DONE' && b.status !== 'DONE')) {
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    }
                    // Put DONE items at the bottom
                    return a.status === 'DONE' ? 1 : -1;
                });

                setBookings(mappedBookings);
            } else {
                Alert.alert("Error", `Server check failed: ${response.status}`);
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchMyBookings();
        }
    }, [isFocused, user?.uid]);


    const renderBookingCard = ({ item }: { item: any }) => {
        const isDone = item.status === 'DONE';

        return (
            <View style={[styles.cardContainer, isDone && styles.cardContainerDone]}>
                {/* Colored Left Border */}
                <View style={[styles.leftBorder, { backgroundColor: isDone ? COLORS.textSecondary : item.color }]} />

                <View style={styles.cardContent}>
                    {/* Top Section */}
                    <View style={styles.cardHeader}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: isDone ? '#F5F5F5' : `${item.color}15` }]}>
                                <Ionicons name={item.icon as any} size={24} color={isDone ? COLORS.textSecondary : item.color} />
                            </View>
                            <View style={styles.headerTextContainer}>
                                <Text style={[styles.groundName, isDone && styles.textDone]}>{item.ground}</Text>
                                <Text style={[styles.eventText, isDone && styles.textDone]}>{item.event}</Text>
                            </View>
                        </View>
                        <TouchableOpacity disabled={isDone}>
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
                                <Text style={[styles.infoText, isDone && styles.textDone]}>{item.date}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} style={styles.infoIcon} />
                                <Text style={[styles.infoText, isDone && styles.textDone]}>{item.time}</Text>
                            </View>
                        </View>

                        <View style={[
                            styles.statusBadge,
                            isDone && styles.statusBadgeCompleted,
                            item.status === 'CONFIRMED' && { backgroundColor: '#E8F5E9' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                isDone && styles.statusTextCompleted,
                                item.status === 'CONFIRMED' && { color: '#2E7D32' }
                            ]}>{item.status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

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
    cardContainerDone: {
        backgroundColor: '#F3F4F6', // Light grey background
        borderColor: '#E5E7EB',
        borderWidth: 1,
        elevation: 0, // Remove shadow for flat look
        shadowOpacity: 0,
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
        paddingRight: SPACING.s,
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
        flex: 1, // Allow text to take available space
        paddingRight: SPACING.m, // Add spacing between text and badge
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 8,
        flexShrink: 0,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
        flexShrink: 1, // Allow text to wrap/shrink if needed
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: RADIUS.s,
        flexShrink: 0, // Prevent badge from shrinking
        minWidth: 80, // Minimum width stability
        alignItems: 'center',
    },
    statusText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadgeCompleted: {
        backgroundColor: '#E0E0E0', // Darker grey for visibility
    },
    statusTextCompleted: {
        color: '#616161', // Dark grey text
    },
    textDone: {
        color: '#757575', // Medium grey for text, readable but distinct from black
    }
});
