import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminBookings'>;

interface Booking {
    bookingId: string;
    groundName: string;
    date: string;
    selectedSlots: string[];
    captainName: string;
    teamName: string;
    purpose: string;
    status: string;
}

export const AdminBookingsScreen: React.FC<Props> = ({ navigation }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/all`);
            const data = await response.json();
            if (data.success) {
                setBookings(data.bookings);
            } else {
                Alert.alert("Error", "Failed to fetch bookings.");
            }
        } catch (error) {
            console.error("Fetch bookings error:", error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const handleDeleteBooking = (bookingId: string) => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking? This action cannot be undone.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                                method: 'DELETE'
                            });
                            const data = await response.json();
                            if (response.ok) {
                                Alert.alert("Success", "Booking cancelled.");
                                fetchBookings(); // Refresh list
                            } else {
                                Alert.alert("Error", data.error || "Failed to cancel booking.");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Network error.");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Booking }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.groundName}>{item.groundName}</Text>
                    <Text style={styles.dateText}>{new Date(item.date).toDateString()}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.selectedSlots.join(', ')}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.captainName} ({item.teamName})</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="flag-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.purpose}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBooking(item.bookingId)}
                >
                    <Ionicons name="trash-outline" size={18} color="#FFF" />
                    <Text style={styles.deleteButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Bookings</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.bookingId}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No bookings found.</Text>
                        </View>
                    }
                />
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    listContent: {
        padding: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m,
        padding: SPACING.m,
        ...SHADOWS.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: SPACING.s,
    },
    groundName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    cardBody: {
        marginBottom: SPACING.m,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: RADIUS.s,
        gap: 6,
    },
    deleteButtonText: {
        color: '#D32F2F',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});
