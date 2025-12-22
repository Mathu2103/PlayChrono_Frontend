import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
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

// --- Admin Home Component ---
const AdminHomeScreen = ({ navigation }: { navigation: any }) => {

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

            {/* Top Bar with Logo/Title and Notification */}
            <View style={styles.topBar}>
                <View style={styles.logoContainer}>
                    <Ionicons name="football" size={24} color={COLORS.primary} />
                    <Text style={styles.logoText}>PlayChrono</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name="notifications" size={24} color={COLORS.text} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                            style={styles.avatarImage}
                        />
                        <View style={styles.onlineBadge} />
                    </View>
                    <View>
                        <Text style={styles.greeting}>Good Morning, Admin</Text>
                        <Text style={styles.role}>Manage your facility</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="New Bookings"
                        count="12"
                        icon="ticket"
                        color={COLORS.primary}
                    />
                    <StatCard
                        label="Pending"
                        count="5"
                        icon="time"
                        color="#FF9800"
                    />
                    <StatCard
                        label="Open Slots"
                        count="3"
                        icon="radio-button-on"
                        color="#9C27B0"
                    />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsList}>
                    <QuickActionItem
                        title="Manage Bookings"
                        subtitle="Review and approve requests"
                        icon="calendar"
                        color="#2196F3"
                        onPress={() => { }}
                    />
                    <QuickActionItem
                        title="Ground Slots"
                        subtitle="Add or modify availability"
                        icon="create"
                        color="#00BCD4"
                        onPress={() => { }}
                    />
                    <QuickActionItem
                        title="Announcements"
                        subtitle="Post updates to students"
                        icon="megaphone"
                        color="#3F51B5"
                        onPress={() => navigation.navigate('NoticesList')}
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
                    <ActivityItem
                        title="Badminton Court A"
                        subtitle="Booked by John Doe"
                        time="2 min ago"
                        status="Pending"
                        type="court"
                    />
                    <ActivityItem
                        title="Basketball Court"
                        subtitle="Slot updated for Evening"
                        time="3 hrs ago"
                        status="Done"
                        type="calendar"
                    />
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

// --- Tab Navigator ---
const Tab = createBottomTabNavigator();

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

export const AdminDashboardScreen: React.FC<Props> = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Bookings') {
                        iconName = focused ? 'ticket' : 'ticket-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={AdminHomeScreen} />
            <Tab.Screen name="Bookings" component={() => <PlaceholderScreen title="Bookings Management" />} />
            <Tab.Screen name="Profile" component={() => <PlaceholderScreen title="Admin Profile" />} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
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
});
