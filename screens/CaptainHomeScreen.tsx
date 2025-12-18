import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const CaptainHomeScreen: React.FC = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Today');

    const NOTIFICATIONS = [
        { id: '1', message: 'Main Ground A is available tomorrow at 4 PM.', time: '10m ago', read: false },
        { id: '2', message: 'New slot opened at Indoor Court.', time: '1h ago', read: true },
    ];

    return (
        <ScreenWrapper style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar */}
                        <Text style={styles.avatarText}>CA</Text>
                    </View>
                    <View>
                        <Text style={styles.greeting}>Hi, Captain Alex</Text>
                        <Text style={styles.teamName}>The Tigers</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="calendar-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowNotifications(!showNotifications)}
                    >
                        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notification Dropdown */}
            {showNotifications && (
                <View style={styles.notificationDropdown}>
                    <Text style={styles.dropdownTitle}>Notifications</Text>
                    {NOTIFICATIONS.map(note => (
                        <TouchableOpacity key={note.id} style={[styles.notificationItem, !note.read && styles.unreadNotification]}>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationMessage}>{note.message}</Text>
                                <Text style={styles.notificationTime}>{note.time}</Text>
                            </View>
                            {!note.read && <View style={styles.unreadDot} />}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Upcoming Booking Card - Removed via user request */}

                {/* Find a Slot Section */}
                <Text style={styles.sectionTitle}>Find a Slot</Text>

                {/* Date Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                    {['Today', 'Tomorrow', 'Wed 18 Oct', 'Thu 19 Oct'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.tab, selectedDate === item && styles.activeTab]}
                            onPress={() => setSelectedDate(item)}
                        >
                            <Text style={[styles.tabText, selectedDate === item && styles.activeTabText]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Slots List */}
                <View style={styles.slotList}>
                    {/* Available Slot */}
                    <View style={styles.slotCard}>
                        <View style={styles.slotContent}>
                            <View style={styles.timeIconBadge}>
                                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.slotDetails}>
                                <Text style={styles.slotTime}>14:00 - 15:30</Text>
                                <Text style={styles.slotGround}>Turf Ground B • <Text style={{ color: COLORS.success }}>Free</Text></Text>
                            </View>
                        </View>

                        <View style={styles.slotActions}>
                            <View style={styles.statusBadgeAvailable}>
                                <Text style={styles.statusTextAvailable}>Available</Text>
                            </View>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.bookButtonText}>Book Slot</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Booked Slot */}
                    <View style={styles.slotCard}>
                        <View style={styles.slotContent}>
                            <View style={[styles.timeIconBadge, styles.iconBadgeDisabled]}>
                                <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
                            </View>
                            <View style={styles.slotDetails}>
                                <Text style={styles.slotTime}>15:30 - 17:00</Text>
                                <Text style={styles.slotGround}>Turf Ground A • Booked</Text>
                            </View>
                        </View>

                        <View style={styles.slotActions}>
                            <TouchableOpacity style={styles.bookedButton} disabled>
                                <Text style={styles.bookedButtonText}>Booked</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Another Available Slot for demo */}
                    <View style={styles.slotCard}>
                        <View style={styles.slotContent}>
                            <View style={styles.timeIconBadge}>
                                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.slotDetails}>
                                <Text style={styles.slotTime}>18:00 - 19:30</Text>
                                <Text style={styles.slotGround}>Main Ground B • <Text style={{ color: COLORS.success }}>Free</Text></Text>
                            </View>
                        </View>

                        <View style={styles.slotActions}>
                            <View style={styles.statusBadgeAvailable}>
                                <Text style={styles.statusTextAvailable}>Available</Text>
                            </View>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.bookButtonText}>Book Slot</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F4F6F9', // Light greyish background resembling the design
    },
    container: {
        padding: SPACING.m,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    avatarText: {
        color: COLORS.surface,
        fontWeight: 'bold',
        fontSize: 18,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    teamName: {
        fontSize: 14,
        color: COLORS.primary, // Using primary color for team name as seen in some designs
        fontWeight: '500',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    iconButton: {
        padding: 4,
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        ...SHADOWS.card,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    matchInfo: {
        flex: 1,
    },
    upcomingBadge: {
        backgroundColor: '#FFF3E0', // Light orange background
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
        marginBottom: SPACING.s,
    },
    upcomingText: {
        color: '#FF9800', // Orange text
        fontSize: 12,
        fontWeight: 'bold',
    },
    matchTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    matchDetailText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    fieldPreview: {
        width: 80,
        height: 80,
        backgroundColor: '#4CAF50',
        borderRadius: RADIUS.m,
        marginLeft: SPACING.m,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#81C784',
    },
    fieldLineCenter: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    fieldCircle: {
        position: 'absolute',
        top: '25%',
        left: '25%',
        width: '50%',
        height: '50%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 40,
    },
    cardActions: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtn: {
        backgroundColor: COLORS.primary,
    },
    primaryBtnText: {
        color: COLORS.surface,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        backgroundColor: '#F5F5F5',
    },
    secondaryBtnText: {
        color: COLORS.text,
        fontWeight: '600',
    },

    // Find Slot Styles
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    tabsContainer: {
        marginBottom: SPACING.m,
    },
    tab: {
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tabText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.surface,
    },

    // Slot List Styles
    slotList: {
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
        marginBottom: SPACING.m,
        alignItems: 'center',
    },
    timeIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD', // Light blue
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    iconBadgeDisabled: {
        backgroundColor: '#F5F5F5',
    },
    timeIcon: {
        fontSize: 18,
    },
    slotDetails: {
        flex: 1,
    },
    slotTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    slotGround: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    slotActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadgeAvailable: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    statusTextAvailable: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bookButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: 8,
        borderRadius: RADIUS.m,
    },
    bookButtonText: {
        color: COLORS.surface,
        fontWeight: '600',
        fontSize: 14,
    },
    bookedButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        borderRadius: RADIUS.m,
        alignItems: 'center',
    },
    bookedButtonText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    // Notification Styles
    notificationDropdown: {
        position: 'absolute',
        top: 80,
        right: SPACING.m,
        width: 300,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        ...SHADOWS.card,
        zIndex: 1000,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dropdownTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    unreadNotification: {
        backgroundColor: '#F0F7FF', // Very light blue for unread
        marginHorizontal: -SPACING.m,
        paddingHorizontal: SPACING.m,
    },
    notificationContent: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    notificationTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginLeft: SPACING.s,
    },
});
