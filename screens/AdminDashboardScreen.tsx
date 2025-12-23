import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';

// Placeholder screens for tabs
const PlaceholderScreen = ({ title }: { title: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 20, color: COLORS.textSecondary }}>{title}</Text>
    </View>
);

import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';

// --- Admin Dashboard Screen ---
export const AdminDashboardScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>) => {
    const isFocused = useIsFocused();
    const [stats, setStats] = useState({
        todayEvents: 0,
        registeredCaptains: 0,
        totalBookings: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    const handleLogout = () => {
        setProfileModalVisible(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Aggregated Stats
            const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`);
            const statsData = await statsRes.json();

            if (statsData.success) {
                setStats({
                    todayEvents: statsData.stats.todayEvents,
                    registeredCaptains: statsData.stats.registeredCaptains,
                    totalBookings: statsData.stats.totalBookings
                });
            }

            // 2. Fetch Recent Activity (using Today's bookings)
            const todayRes = await fetch(`${API_BASE_URL}/api/bookings/today`);
            const todayData = await todayRes.json();

            // Map today's bookings to activity feed as a "Live Feed"
            if (todayData.bookings) {
                const activities = todayData.bookings.slice(0, 5).map((b: any, index: number) => ({
                    id: index.toString(),
                    title: `${b.groundName} Booking`,
                    subtitle: `Booked by ${b.teamName || b.captainName}`,
                    time: 'Today',
                    status: 'Confirmed', // We only fetch confirmed ones
                    type: 'calendar'
                }));
                setRecentActivity(activities);
            }

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchAdminData();
        }
    }, [isFocused]);

    const QuickActionItem = ({ title, subtitle, icon, color, onPress }: any) => (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={[styles.actionIconCircle, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    const StatCard = ({ label, count, subLabel, icon, color }: any) => (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon} size={18} color={color} />
                </View>
            </View>
            <Text style={styles.statCount}>{count}</Text>
            <Text style={styles.statLabel}>{label}</Text>
            {subLabel && <Text style={styles.statSubLabel}>{subLabel}</Text>}
        </View>
    );

    const ActivityItem = ({ title, subtitle, time, status, type }: any) => (
        <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#F5F5F5' }]}>
                <Ionicons
                    name={type === 'court' ? 'tennisball-outline' : 'calendar-outline'}
                    size={20}
                    color={COLORS.textSecondary}
                />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activitySubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.activityRight}>
                <Text style={styles.activityTime}>{time}</Text>
                <View style={[
                    styles.statusBadge,
                    status === 'Pending' ? { backgroundColor: '#FFF3E0' } : { backgroundColor: '#E8F5E9' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        status === 'Pending' ? { color: '#FF9800' } : { color: '#4CAF50' }
                    ]}>{status}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar style="dark" />

            {/* Top Bar with Profile Trigger */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.headerProfileContainer} onPress={() => setProfileModalVisible(true)}>
                    <View style={styles.headerAvatar}>
                        <Ionicons name="person" size={24} color={COLORS.textSecondary} />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <Text style={styles.headerSubtitle}>System Overview</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                {/* Stats Row */}

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="Today's Events"
                        count={loading ? "-" : stats.todayEvents.toString()}
                        icon="calendar"
                        color={COLORS.primary}
                    />
                    <StatCard
                        label="Reg. Captains"
                        count={loading ? "-" : stats.registeredCaptains.toString()}
                        icon="people"
                        color="#FF9800"
                    />
                    <StatCard
                        label="Total Bookings"
                        count={loading ? "-" : stats.totalBookings.toString()}
                        icon="bookmarks"
                        color="#9C27B0"
                    />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsList}>
                    <QuickActionItem
                        title="Manage Bookings"
                        subtitle="Cancel or Delete bookings"
                        icon="calendar"
                        color="#2196F3"
                        onPress={() => navigation.navigate('AdminBookings')}
                    />
                    <QuickActionItem
                        title="Users Management"
                        subtitle="View Captains details"
                        icon="people"
                        color="#00BCD4"
                        onPress={() => navigation.navigate('AdminUsersList')}
                    />
                    <QuickActionItem
                        title="Announcements"
                        subtitle="Write text notices"
                        icon="megaphone"
                        color="#3F51B5"
                        onPress={() => navigation.navigate('CreateNotice')}
                    />
                </View>

                {/* Recent Activity */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.activityList}>
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <ActivityItem
                                key={index}
                                title={activity.title}
                                subtitle={activity.subtitle}
                                time={activity.time}
                                status={activity.status}
                                type={activity.type}
                            />
                        ))
                    ) : (
                        <Text style={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>No recent activity to show.</Text>
                    )}
                </View>




            </ScrollView>

            {/* Profile Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={profileModalVisible}
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setProfileModalVisible(false)}
                >
                    <View style={styles.profileModalContent}>
                        <View style={styles.profileHeader}>
                            <View style={styles.largeAvatarContainer}>
                                <Ionicons name="person" size={60} color={COLORS.surface} />
                            </View>
                            <Text style={styles.profileName}>Admin</Text>
                            <Text style={styles.profileTeam}>System Administrator</Text>
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                            <Ionicons name="log-out-outline" size={20} color={COLORS.surface} style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScreenWrapper >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    topBar: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    headerProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        marginRight: SPACING.m,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatarImage: {
        width: '100%',
        height: '100%',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    notificationBtn: {
        position: 'relative',
        padding: 4,
    },
    notificationDot: {
        position: 'absolute',
        top: 4,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        borderWidth: 1,
        borderColor: COLORS.surface,
    },
    scrollContent: {
        padding: SPACING.m,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.l,
        marginTop: SPACING.s,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: SPACING.m,
    },
    avatarImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E0E0E0',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50', // Online green
        borderWidth: 2,
        borderColor: '#F7F9FC',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    role: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        ...SHADOWS.card,
        minHeight: 110,
        justifyContent: 'space-between',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    statIcon: {
        padding: 6,
        borderRadius: RADIUS.s,
    },
    statCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    statSubLabel: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    // Quick Actions
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    actionsList: {
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        ...SHADOWS.card,
    },
    actionIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    actionContent: {
        flex: 1,
    },
    activityContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    // Activity
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    viewAllText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    activityList: {
        gap: SPACING.m,
        paddingBottom: SPACING.l,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    activitySubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    activityRight: {
        alignItems: 'flex-end',
        marginLeft: 'auto',
    },
    activityTime: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    profileModalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 32,
        width: '85%',
        maxWidth: 340,
        alignItems: 'center',
        ...SHADOWS.card,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    largeAvatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
        borderWidth: 4,
        borderColor: COLORS.surface,
        overflow: 'hidden',
        elevation: 5,
    },
    largeAvatar: {
        width: '100%',
        height: '100%',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    profileTeam: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
        width: '100%',
        justifyContent: 'center',
        elevation: 5,
    },
    logoutButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: -4,
    },
});
