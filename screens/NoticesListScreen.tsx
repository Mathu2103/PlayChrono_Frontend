import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticesList'>;

// Mock data for Daily Schedule (will be replaced by backend API)
const DAILY_SCHEDULE = [
    {
        id: '101',
        ground: 'Main Cricket Ground',
        timeSlot: '09:00 AM - 11:00 AM',
        purpose: 'Inter-Department Match',
        team: 'Computer Science vs Mechanical',
        status: 'Booked'
    },
    {
        id: '102',
        ground: 'Football Field A',
        timeSlot: '04:00 PM - 06:00 PM',
        purpose: 'Team Practice',
        team: 'University Football Team',
        status: 'Booked'
    },
    {
        id: '103',
        ground: 'Basketball Court',
        timeSlot: '05:00 PM - 07:00 PM',
        purpose: 'Friendly Match',
        team: 'Year 1 vs Year 2',
        status: 'Booked'
    }
];

export const NoticesListScreen: React.FC<Props> = ({ navigation }) => {

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
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {DAILY_SCHEDULE.length > 0 ? (
                    DAILY_SCHEDULE.map((item) => (
                        <View key={item.id} style={styles.scheduleCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.groundName}>{item.ground}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>

                            <View style={styles.cardBody}>
                                <View style={styles.infoRow}>
                                    <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                    <Text style={styles.infoText}>{item.timeSlot}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Ionicons name="football-outline" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.infoText}>{item.purpose}</Text>
                                </View>
                                {item.team && (
                                    <View style={styles.infoRow}>
                                        <Ionicons name="people-outline" size={20} color={COLORS.textSecondary} />
                                        <Text style={styles.infoText}>{item.team}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No bookings for today</Text>
                    </View>
                )}
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
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});
