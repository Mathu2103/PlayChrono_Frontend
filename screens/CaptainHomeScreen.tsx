import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

export const CaptainHomeScreen: React.FC = () => {
    return (
        <ScreenWrapper style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>Captain Alex</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>

                {/* Weather / Date Widget */}
                <View style={styles.weatherWidget}>
                    <View>
                        <Text style={styles.dateText}>Wed, 17 Dec</Text>
                        <Text style={styles.weatherText}>Sunny, 28°C</Text>
                    </View>
                    <Text style={styles.weatherIcon}>☀️</Text>
                </View>

                {/* Upcoming Booking Card */}
                <Text style={styles.sectionTitle}>Up Next</Text>
                <TouchableOpacity style={styles.matchCard}>
                    <View style={styles.matchHeader}>
                        <Text style={styles.matchType}>Football • 5v5</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Confirmed</Text>
                        </View>
                    </View>

                    <View style={styles.matchInfo}>
                        <View style={styles.matchDetail}>
                            <Text style={styles.detailLabel}>Time</Text>
                            <Text style={styles.detailValue}>06:00 PM</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.matchDetail}>
                            <Text style={styles.detailLabel}>Ground</Text>
                            <Text style={styles.detailValue}>Main Turf A</Text>
                        </View>
                    </View>

                    <View style={styles.teamInfo}>
                        <View style={styles.avatarGroup}>
                            <View style={[styles.avatar, { backgroundColor: '#FFCDD2' }]}><Text>A</Text></View>
                            <View style={[styles.avatar, { backgroundColor: '#E1BEE7', marginLeft: -10 }]}><Text>B</Text></View>
                            <View style={[styles.avatar, { backgroundColor: '#C5CAE9', marginLeft: -10 }]}><Text>+3</Text></View>
                        </View>
                        <Text style={styles.vsText}>vs</Text>
                        <Text style={styles.opponentName}>Rival Titans</Text>
                    </View>
                </TouchableOpacity>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Text>📅</Text>
                        </View>
                        <Text style={styles.actionText}>New Booking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Text>👥</Text>
                        </View>
                        <Text style={styles.actionText}>Manage Team</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <Text>📢</Text>
                        </View>
                        <Text style={styles.actionText}>Notices</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityList}>
                    {[1, 2, 3].map((_, i) => (
                        <View key={i} style={styles.activityItem}>
                            <View style={styles.activityIcon}>
                                <Text>📌</Text>
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>Booking Request Approved</Text>
                                <Text style={styles.activityTime}>2 hours ago</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F8F9FE', // Slightly lighter background for dashboard
    },
    container: {
        padding: SPACING.l,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    notificationButton: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationIcon: {
        fontSize: 20,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        borderWidth: 1.5,
        borderColor: COLORS.surface,
    },
    weatherWidget: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        marginBottom: SPACING.xl,
    },
    dateText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    weatherText: {
        color: COLORS.surface,
        fontSize: 20,
        fontWeight: 'bold',
    },
    weatherIcon: {
        fontSize: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    matchCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    matchType: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2E7D32',
    },
    matchInfo: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        backgroundColor: '#F5F5F5',
        padding: SPACING.s,
        borderRadius: RADIUS.m,
    },
    matchDetail: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatarGroup: {
        flexDirection: 'row',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    vsText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    opponentName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    actionCard: {
        backgroundColor: COLORS.surface,
        width: '30%',
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        gap: SPACING.s,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },
    activityList: {
        gap: SPACING.m,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
    },
    activityIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: RADIUS.s,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    activityTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
});
