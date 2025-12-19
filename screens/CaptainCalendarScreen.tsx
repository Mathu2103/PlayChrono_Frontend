import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DAYS_OF_WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

// Helper to generate calendar days
const generateDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust for Monday start: 0->6, 1->0, ...
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Previous month padding
    for (let i = 0; i < startOffset; i++) {
        days.push({ day: null, key: `prev-${i}` });
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, key: `day-${i}` });
    }
    return days;
};

export const CaptainCalendarScreen: React.FC = () => {
    const navigation = useNavigation();

    // Default to a date in 2025 as requested
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
    const [selectedDay, setSelectedDay] = useState(18);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const calendarDays = generateDays(year, month);

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(year, month + delta, 1));
        setSelectedDay(1); // Reset selection
    };

    const renderDay = ({ item }: { item: any }) => {
        if (!item.day) return <View style={styles.dayCell} />;

        const isSelected = item.day === selectedDay;
        // Mock dots
        const hasDot = [3, 6, 13, 20, 27].includes(item.day);

        return (
            <TouchableOpacity
                style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                onPress={() => setSelectedDay(item.day)}
            >
                <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                    {item.day}
                </Text>
                {hasDot && !isSelected && <View style={[styles.dot, { backgroundColor: item.day === 27 ? COLORS.success : COLORS.secondary }]} />}
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Calendar Card */}
                <View style={styles.calendarCard}>
                    {/* Month Navigator */}
                    <View style={styles.monthHeader}>
                        <TouchableOpacity onPress={() => changeMonth(-1)}>
                            <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{monthNames[month]} {year}</Text>
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
                        {calendarDays.map((item, index) => (
                            <View key={index} style={styles.dayWrapper}>
                                {renderDay({ item })}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Selected Date Title */}
                <View style={styles.slotsHeader}>
                    <Text style={styles.selectedDateTitle}>
                        {new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </Text>
                </View>

                {/* Status List (No buttons, simplified) */}
                <View style={styles.slotList}>
                    {/* Item 1: Booked - Red */}
                    <View style={styles.statusItem}>
                        <View style={[styles.statusIcon, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="close-circle" size={24} color="#D32F2F" />
                        </View>
                        <View style={styles.statusDetails}>
                            <Text style={styles.groundName}>Turf Ground A</Text>
                            <Text style={[styles.statusText, { color: '#D32F2F' }]}>Booked</Text>
                        </View>
                    </View>

                    {/* Item 2: Available - Dark Blue */}
                    <View style={styles.statusItem}>
                        <View style={[styles.statusIcon, { backgroundColor: '#E8EAF6' }]}>
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.statusDetails}>
                            <Text style={styles.groundName}>Turf Ground B</Text>
                            <Text style={[styles.statusText, { color: COLORS.primary }]}>Available</Text>
                        </View>
                    </View>

                    {/* Item 3: Available - Dark Blue */}
                    <View style={styles.statusItem}>
                        <View style={[styles.statusIcon, { backgroundColor: '#E8EAF6' }]}>
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.statusDetails}>
                            <Text style={styles.groundName}>Indoor Court</Text>
                            <Text style={[styles.statusText, { color: COLORS.primary }]}>Available</Text>
                        </View>
                    </View>
                </View>

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
        paddingVertical: SPACING.s,
        backgroundColor: COLORS.surface,
    },
    iconButton: {
        padding: 4,
    },

    // Calendar Card
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
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    weekDayText: {
        width: 40,
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
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCell: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    selectedDayCell: {
        backgroundColor: COLORS.primary, // Dark Blue #1a237e
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    dayText: {
        fontSize: 14,
        color: COLORS.text,
    },
    selectedDayText: {
        color: COLORS.surface,
        fontWeight: 'bold',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 4,
    },

    // Status List Section
    slotsHeader: {
        marginBottom: SPACING.m,
    },
    selectedDateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    slotList: {
        gap: SPACING.m,
    },
    statusItem: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        ...SHADOWS.card,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    statusDetails: {
        flex: 1,
    },
    groundName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
});
