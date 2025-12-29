import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Check if two dates are same day
const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const CaptainCalendarScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user } = useUser();

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Data State
    const [loading, setLoading] = useState(false);
    const [grounds, setGrounds] = useState<any[]>([]);

    // Valid Range: Today to Today + 6
    const today = new Date();
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 6);

    // Initial Selection (Today)
    useEffect(() => {
        handleDateSelect(today);
    }, []);

    const fetchAvailability = async (date: Date) => {
        try {
            setLoading(true);
            const dateStr = formatDate(date);
            const sport = user?.sportType || 'Football';
            const encSport = encodeURIComponent(sport);
            const encDate = encodeURIComponent(dateStr);
            const url = `${API_BASE_URL}/api/bookings/available?sport=${encSport}&date=${encDate}`;

            console.log("Fetching availability for:", url);
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setGrounds(data.grounds);
            } else {
                console.error("Fetch failed:", response.status);
                // Don't alert on simple failures to keep UI clean, maybe just empty list
                setGrounds([]);
            }
        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: Date) => {
        // Validate date
        if (date < today || date > maxDate) {
            // Outside valid range
            return;
        }

        setSelectedDate(date);
        fetchAvailability(date);
    };

    const changeMonth = (delta: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + delta);
        setCurrentMonth(newMonth);
    };

    const navigateToSchedule = () => {
        if (!selectedDate) return;
        const dateStr = formatDate(selectedDate);
        // Navigate to CaptainHome (Schedule Tab) with params
        navigation.navigate('CaptainHome', { date: dateStr });
    };

    // Generate Calendar Grid
    const generateDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push({ key: `empty-${i}`, empty: true });
        }
        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            date.setHours(0, 0, 0, 0);

            const isValid = date >= today && date <= maxDate;
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

            days.push({
                key: `day-${i}`,
                day: i,
                date,
                isValid,
                isSelected
            });
        }
        return days;
    };

    const calendarGrid = generateDays();
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Date</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Calendar Card */}
                <View style={styles.calendarCard}>
                    {/* Month Navigator */}
                    <View style={styles.monthHeader}>
                        <TouchableOpacity onPress={() => changeMonth(-1)}>
                            <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{monthName}</Text>
                        <TouchableOpacity onPress={() => changeMonth(1)}>
                            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Weekdays */}
                    <View style={styles.weekRow}>
                        {DAYS_OF_WEEK.map(d => (
                            <Text key={d} style={styles.weekDayText}>{d}</Text>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.daysGrid}>
                        {calendarGrid.map((item: any, index) => {
                            if (item.empty) {
                                return <View key={item.key} style={styles.dayWrapper} />;
                            }
                            return (
                                <View key={item.key} style={styles.dayWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.dayCell,
                                            item.isValid && styles.validDayCell,
                                            item.isSelected && styles.selectedDayCell,
                                            !item.isValid && styles.disabledDayCell
                                        ]}
                                        onPress={() => item.isValid && handleDateSelect(item.date)}
                                        activeOpacity={item.isValid ? 0.7 : 1}
                                    >
                                        <Text style={[
                                            styles.dayText,
                                            item.isSelected && styles.selectedDayText,
                                            !item.isValid && styles.disabledDayText
                                        ]}>
                                            {item.day}
                                        </Text>
                                        {item.isValid && !item.isSelected && <View style={styles.validDot} />}
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Selected Info / Availability */}
                {selectedDate && (
                    <View style={styles.resultsSection}>
                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultsTitle}>
                                Availability for {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                        </View>

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Checking grounds...</Text>
                            </View>
                        ) : (
                            <View style={styles.slotsList}>
                                {grounds.length > 0 ? (
                                    grounds.map((ground) => {
                                        const isFullyBooked = ground.availableCount === 0;
                                        return (
                                            <TouchableOpacity
                                                key={ground.groundId}
                                                style={styles.slotCard}
                                                onPress={navigateToSchedule}
                                            >
                                                <View style={styles.slotContent}>
                                                    <View style={[styles.groundIcon, isFullyBooked && styles.groundIconDisabled]}>
                                                        <Ionicons
                                                            name={isFullyBooked ? "close-circle-outline" : "football-outline"}
                                                            size={24}
                                                            color={isFullyBooked ? COLORS.textSecondary : COLORS.primary}
                                                        />
                                                    </View>
                                                    <View style={styles.slotInfo}>
                                                        <Text style={styles.groundName}>{ground.groundName}</Text>

                                                        {isFullyBooked ? (
                                                            <Text style={styles.unavailableText}>Fully Booked</Text>
                                                        ) : (
                                                            <View style={styles.availableBadge}>
                                                                <Text style={styles.availableText}>{ground.availableCount} slots available</Text>
                                                            </View>
                                                        )}

                                                        {!isFullyBooked && (
                                                            <View style={styles.timesList}>
                                                                {ground.slots
                                                                    .filter((s: any) => s.status === 'available')
                                                                    .map((s: any) => (
                                                                        <Text key={s.id} style={styles.timeTag}>{s.time}</Text>
                                                                    ))}
                                                            </View>
                                                        )}
                                                    </View>

                                                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.noInfoText}>No ground information available.</Text>
                                )}


                            </View>
                        )}
                    </View>
                )}

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F4F6F9',
        flex: 1,
    },
    container: {
        padding: SPACING.m,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    iconButton: {
        padding: 4,
    },
    // Calendar
    calendarCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.m,
        ...SHADOWS.card,
        marginBottom: SPACING.l,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    weekDayText: {
        width: '14.28%',
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 12,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayWrapper: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    dayCell: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    // Styles for different states
    validDayCell: {
        // Normal valid day (can be clicked)
    },
    disabledDayCell: {
        opacity: 0.3, // "Blurred" effect for unreachable dates
    },
    selectedDayCell: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.card, // Add some shadow
    },
    dayText: {
        fontSize: 14,
        color: COLORS.text,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledDayText: {
        color: COLORS.textSecondary,
    },
    validDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.success,
        position: 'absolute',
        bottom: 4,
    },

    // Results
    resultsSection: {
        marginTop: SPACING.s,
    },
    resultsHeader: {
        marginBottom: SPACING.m,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    loadingContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.m,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    slotsList: {
        gap: SPACING.m,
    },
    slotCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        ...SHADOWS.card,
    },
    slotContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    groundIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8EAF6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    groundIconDisabled: {
        backgroundColor: '#FAFAFA',
    },
    slotInfo: {
        flex: 1,
    },
    groundName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    unavailableText: {
        color: COLORS.error,
        fontWeight: '600',
        fontSize: 13,
    },
    availableBadge: {
        backgroundColor: '#E8F5E9',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 6,
    },
    availableText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    timesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    timeTag: {
        fontSize: 12,
        color: COLORS.text,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    moreTag: {
        fontSize: 11,
        color: COLORS.textSecondary,
        paddingTop: 2,
    },
    noInfoText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginTop: SPACING.l,
    },
    scheduleButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.s,
        gap: 8,
    },
    scheduleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
