import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { NoticeCard } from '../components/NoticeCard';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Notice } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticesList'>;

// Mock data - Replace with API call later
const MOCK_NOTICES: Notice[] = [
    {
        id: '1',
        title: 'Ground Maintenance Notice',
        message: 'Cricket ground will be closed for maintenance from 20th to 22nd December. All bookings during this period will be rescheduled.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdBy: { userId: 'admin1', name: 'Admin', role: 'Admin' },
        targetAudience: 'Cricket',
        priority: 'Urgent',
    },
    {
        id: '2',
        title: 'Inter-University Tournament',
        message: 'Registration open for Inter-University Football Tournament. Register your team before 25th December.',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        createdBy: { userId: 'capt1', name: 'Football Captain', role: 'Captain' },
        targetAudience: 'Football',
        priority: 'Important',
    },
    {
        id: '3',
        title: 'New Booking System Update',
        message: 'New features added to the booking system. Now you can book slots up to 7 days in advance.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdBy: { userId: 'admin1', name: 'Admin', role: 'Admin' },
        targetAudience: 'All',
        priority: 'General',
    },
];

export const NoticesListScreen: React.FC<Props> = ({ navigation }) => {
    const [filter, setFilter] = useState<'All' | 'Cricket' | 'Football' | 'Basketball' | 'Badminton'>('All');

    const filteredNotices = filter === 'All' 
        ? MOCK_NOTICES 
        : MOCK_NOTICES.filter(n => n.targetAudience === filter || n.targetAudience === 'All');

    const filters = ['All', 'Cricket', 'Football', 'Basketball', 'Badminton'];

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
                <Text style={styles.title}>Notices</Text>
            </View>

            {/* Filters */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterChip,
                            filter === f && styles.filterChipActive
                        ]}
                        onPress={() => setFilter(f as any)}
                    >
                        <Text style={[
                            styles.filterText,
                            filter === f && styles.filterTextActive
                        ]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Notices List */}
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <NoticeCard
                            key={notice.id}
                            notice={notice}
                            onPress={() => navigation.navigate('NoticeDetail', { noticeId: notice.id })}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No notices available</Text>
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
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
    },
    filtersContainer: {
        maxHeight: 50,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    filtersContent: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        gap: SPACING.s,
    },
    filterChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.xl,
        backgroundColor: COLORS.background,
        marginRight: SPACING.s,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    filterTextActive: {
        color: COLORS.surface,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        padding: SPACING.m,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: SPACING.xl * 2,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});
