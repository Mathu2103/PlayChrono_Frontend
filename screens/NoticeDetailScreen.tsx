import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Notice } from '../types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticeDetail'>;

// Mock data - Replace with API call later
const MOCK_NOTICES: Notice[] = [
    {
        id: '1',
        title: 'Ground Maintenance Notice',
        message: 'Cricket ground will be closed for maintenance from 20th to 22nd December. All bookings during this period will be rescheduled.\n\nWe apologize for any inconvenience caused. Alternative arrangements can be made at the Football ground during these days.\n\nFor any queries, contact the sports office.',
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

export const NoticeDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { noticeId } = route.params;
    const notice = MOCK_NOTICES.find(n => n.id === noticeId);

    if (!notice) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Notice not found</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }

    const getPriorityColor = () => {
        switch (notice.priority) {
            case 'Urgent': return '#d32f2f';
            case 'Important': return '#ffc107';
            case 'General': return '#388e3c';
            default: return COLORS.textSecondary;
        }
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <Text style={styles.headerTitle}>Notice Details</Text>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Priority & Sport Badges */}
                <View style={styles.badgesContainer}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                        <Text style={styles.priorityText}>{notice.priority.toUpperCase()}</Text>
                    </View>
                    {notice.targetAudience !== 'All' && (
                        <View style={styles.sportBadge}>
                            <Text style={styles.sportText}>{notice.targetAudience}</Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <Text style={styles.title}>{notice.title}</Text>

                {/* Metadata */}
                <View style={styles.metaContainer}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Posted by:</Text>
                        <Text style={styles.metaValue}>{notice.createdBy.name} ({notice.createdBy.role})</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Date:</Text>
                        <Text style={styles.metaValue}>{formatDate(notice.createdAt)}</Text>
                    </View>
                    {notice.targetAudience !== 'All' && (
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Target:</Text>
                            <Text style={styles.metaValue}>{notice.targetAudience} Team</Text>
                        </View>
                    )}
                </View>

                {/* Message */}
                <View style={styles.messageContainer}>
                    <Text style={styles.messageLabel}>Message</Text>
                    <Text style={styles.message}>{notice.message}</Text>
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
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.m,
    },
    badgesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    priorityBadge: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.s,
        marginRight: SPACING.s,
    },
    priorityText: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: '700',
    },
    sportBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.s,
    },
    sportText: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.m,
        lineHeight: 34,
    },
    metaContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.card,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: SPACING.s,
    },
    metaLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        width: 90,
    },
    metaValue: {
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    messageContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        ...SHADOWS.card,
    },
    messageLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    message: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 24,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
    },
    backLink: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
    },
});
