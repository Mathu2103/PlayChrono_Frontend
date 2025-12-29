import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config';

interface Slot {
    id: string;
    time: string;
    status: 'available' | 'booked';
}

interface Ground {
    groundId: string;
    groundName: string;
    slots: Slot[];
    availableCount: number;
}

interface TextNotice {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    createdBy: { name: string };
}





export const CaptainHomeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { user, setUser } = useUser();
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [notices, setNotices] = useState<TextNotice[]>([]);
    const [loadingNotices, setLoadingNotices] = useState(false);

    // ... (fetchNotices remains here)
    const fetchNotices = async () => {
        try {
            setLoadingNotices(true);
            const response = await fetch(`${API_BASE_URL}/api/notices`);
            const data = await response.json();
            if (data.success && data.notices) {
                setNotices(data.notices);
            }
        } catch (error) {
            console.error("Failed to fetch notices", error);
        } finally {
            setLoadingNotices(false);
        }
    };

    const [profileModalVisible, setProfileModalVisible] = useState(false);

    // Initialize selectedDate from params if available, else default to today
    const [selectedDate, setSelectedDate] = useState(() => {
        if (route.params?.date) {
            return route.params.date;
        }
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    // Update selectedDate if params change while screen is already mounted/focused
    useEffect(() => {
        if (route.params?.date) {
            setSelectedDate(route.params.date);
        }
    }, [route.params?.date]);

    // API Data State
    const [grounds, setGrounds] = useState<Ground[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedGroundId, setSelectedGroundId] = useState('');
    const [selectedGroundName, setSelectedGroundName] = useState('');
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [bookingPurpose, setBookingPurpose] = useState('');

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const sport = user?.sportType || 'Football';
            const encSport = encodeURIComponent(sport);
            const encDate = encodeURIComponent(selectedDate);
            const url = `${API_BASE_URL}/api/bookings/available?sport=${encSport}&date=${encDate}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setGrounds(data.grounds);
            } else {
                Alert.alert("Error", `Fetch failed: ${response.status}`);
            }
        } catch (error) {
            Alert.alert("Network Error", "Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, [selectedDate, user?.sportType]);


    const handleBookSlot = (groundId: string, groundName: string) => {
        setSelectedGroundId(groundId);
        setSelectedGroundName(groundName);
        setSelectedSlotIds([]);
        setBookingPurpose('');
        setBookingStep(1);
        setModalVisible(true);
    };

    const toggleSlotSelection = (id: string) => {
        if (selectedSlotIds.includes(id)) {
            setSelectedSlotIds(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedSlotIds(prev => [...prev, id]);
        }
    };

    const handleNextStep = () => {
        if (!bookingPurpose) {
            Alert.alert("Required", "Please select a purpose.");
            return;
        }
        setBookingStep(2);
    };

    const confirmBooking = async () => {
        if (selectedSlotIds.length === 0) {
            Alert.alert("Required", "Please select at least one slot.");
            return;
        }
        try {
            const currentGround = grounds.find(g => g.groundId === selectedGroundId);
            if (!currentGround) return;
            const selectedTimeSlots = currentGround.slots
                .filter(s => selectedSlotIds.includes(s.id)).map(s => s.time);

            const bookingData = {
                captainId: user?.uid,
                captainName: user?.username || 'Captain',
                teamName: user?.teamName || 'Team',
                sportType: user?.sportType || 'Football',
                groundId: selectedGroundId,
                groundName: selectedGroundName,
                date: selectedDate,
                selectedSlots: selectedTimeSlots,
                purpose: bookingPurpose
            };
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const resData = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Booking Confirmed!");
                setModalVisible(false);
                fetchAvailability();
            } else {
                Alert.alert("Booking Failed", resData.error || "Please try again.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to server.");
        }
    };


    const cancelBooking = () => {
        setModalVisible(false);
        setSelectedSlotIds([]);
        setBookingStep(1);
    };

    const handleLogout = () => {
        setProfileModalVisible(false);
        setUser(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };



    return (
        <ScreenWrapper style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
                        <View style={styles.avatarContainer}>
                            {user?.profileImage ? (
                                <Image
                                    source={{ uri: user.profileImage }}
                                    style={{ width: 48, height: 48, borderRadius: 24 }}
                                />
                            ) : (
                                <Text style={styles.avatarText}>
                                    {user?.username ? user.username.charAt(0).toUpperCase() : 'C'}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.greeting}>Hi, {user?.username || 'Captain'}</Text>
                        <Text style={styles.teamName}>{user?.teamName || 'Team'}</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('CaptainCalendar')}
                    >
                        <Ionicons name="calendar-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setNotificationModalVisible(true);
                            fetchNotices();
                        }}
                    >
                        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View >

            {/* Notification Dropdown */}


            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Upcoming Booking Card - Removed via user request */}

                {/* Date Tabs */}
                {/* Find a Slot Section */}
                {/* Date Tabs - Dynamic Generation */}
                <Text style={styles.sectionTitle}>Find a Slot</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                    {(() => {
                        const dates = [];
                        const today = new Date();
                        for (let i = 0; i < 7; i++) {
                            const d = new Date(today);
                            d.setDate(today.getDate() + i);

                            const year = d.getFullYear();
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            const dateValue = `${year}-${month}-${day}`;

                            let label = '';
                            if (i === 0) label = 'Today';
                            else if (i === 1) label = 'Tomorrow';
                            else {
                                label = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                            }
                            dates.push({ label, value: dateValue });
                        }

                        return dates.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[styles.tab, selectedDate === item.value && styles.activeTab]}
                                onPress={() => setSelectedDate(item.value)}
                            >
                                <Text style={[styles.tabText, selectedDate === item.value && styles.activeTabText]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ));
                    })()}
                </ScrollView>

                {/* Slots List */}
                <View style={styles.slotList}>
                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                    ) : (
                        grounds.map((ground) => {
                            const isFullyBooked = ground.availableCount === 0;

                            return (
                                <View key={ground.groundId} style={styles.slotCard}>
                                    <View style={styles.slotContent}>
                                        <View style={[styles.timeIconBadge, isFullyBooked && styles.iconBadgeDisabled]}>
                                            <Ionicons
                                                name="football-outline"
                                                size={20}
                                                color={isFullyBooked ? COLORS.textSecondary : COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.slotDetails}>
                                            <Text style={styles.slotTime}>{ground.groundName}</Text>
                                            <Text style={styles.slotGround}>
                                                {isFullyBooked ? 'No slots available' : `${ground.availableCount} slots available`}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.slotActions}>
                                        <TouchableOpacity
                                            style={[styles.bookButton, isFullyBooked && { backgroundColor: '#BDBDBD' }]}
                                            disabled={isFullyBooked}
                                            onPress={() => handleBookSlot(ground.groundId, ground.groundName)}
                                        >
                                            <Text style={styles.bookButtonText}>Check Availability</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>

            {/* Custom Booking Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cancelBooking}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {bookingStep === 1 ? 'Select Purpose' : 'Select Time Slots'}
                            </Text>
                        </View>

                        {bookingStep === 1 ? (
                            <>
                                <Text style={styles.modalLabel}>Booking Purpose:</Text>
                                <View style={styles.purposeContainer}>
                                    {['Practice', 'Friendly Match', 'Tournament'].map((purpose) => (
                                        <TouchableOpacity
                                            key={purpose}
                                            style={[styles.purposeChip, bookingPurpose === purpose && styles.activePurposeChip]}
                                            onPress={() => setBookingPurpose(purpose)}
                                        >
                                            <Text style={[styles.purposeText, bookingPurpose === purpose && styles.activePurposeText]}>
                                                {purpose}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalLabel}>Available Slots ({selectedGroundName})</Text>
                                <ScrollView style={styles.slotSelectionList}>
                                    {grounds
                                        .find(g => g.groundId === selectedGroundId)?.slots
                                        .map(slot => {
                                            const isSelected = selectedSlotIds.includes(slot.id);
                                            const isDisabled = slot.status === 'booked';

                                            return (
                                                <TouchableOpacity
                                                    key={slot.id}
                                                    style={[
                                                        styles.slotSelectionChip,
                                                        isSelected && styles.selectedSlotChip,
                                                        isDisabled && styles.disabledSlotChip
                                                    ]}
                                                    disabled={isDisabled}
                                                    onPress={() => toggleSlotSelection(slot.id)}
                                                >
                                                    <Text style={[
                                                        styles.slotChipText,
                                                        isSelected && styles.selectedSlotChipText,
                                                        isDisabled && styles.disabledSlotChipText
                                                    ]}>
                                                        {slot.time}
                                                    </Text>

                                                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                                                </TouchableOpacity>
                                            )
                                        })}
                                </ScrollView>
                            </>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={cancelBooking}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            {bookingStep === 1 ? (
                                <TouchableOpacity style={styles.confirmBtn} onPress={handleNextStep}>
                                    <Text style={styles.confirmBtnText}>Next</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.confirmBtn} onPress={confirmBooking}>
                                    <Text style={styles.confirmBtnText}>Confirm Booking</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Notification Popup Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={notificationModalVisible}
                onRequestClose={() => setNotificationModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.notificationModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Announcements</Text>
                            <TouchableOpacity onPress={() => setNotificationModalVisible(false)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        {loadingNotices ? (
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        ) : (
                            <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
                                {notices.length > 0 ? (
                                    notices.map((item) => (
                                        <View key={item.id} style={styles.noticeCard}>
                                            <View style={styles.noticeHeader}>
                                                <View style={styles.noticeIconContainer}>
                                                    <Ionicons name="megaphone" size={20} color="#fff" />
                                                </View>
                                                <View style={styles.noticeHeaderText}>
                                                    <Text style={styles.noticeTitle}>{item.title}</Text>
                                                    <Text style={styles.noticeDate}>{new Date(item.createdAt).toDateString()}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.noticeMessage}>{item.message}</Text>
                                            <Text style={styles.noticeAuthor}>- {item.createdBy?.name || 'Admin'}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>No new announcements.</Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

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
                                {user?.profileImage ? (
                                    <Image
                                        source={{ uri: user.profileImage }}
                                        style={styles.largeAvatar}
                                    />
                                ) : (
                                    <Text style={styles.largeAvatarText}>
                                        {user?.username ? user.username.charAt(0).toUpperCase() : 'C'}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.profileName}>Hi, {user?.username}</Text>
                            <Text style={styles.profileTeam}>{user?.teamName}</Text>
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
    // Notification Modal Styles
    notificationModalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        width: '90%',
        maxHeight: '80%',
        ...SHADOWS.card,
    },
    closeButton: {
        padding: 4,
    },
    notificationList: {
        marginTop: SPACING.s,
    },
    emptyContainer: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    // Notice Card Styles (Yellow Theme)
    noticeCard: {
        backgroundColor: '#FFFDE7', // Light yellow background
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderLeftWidth: 4,
        borderLeftColor: '#FBC02D', // Strong yellow accent
        elevation: 2,
    },
    noticeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    noticeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FBC02D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    noticeHeaderText: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F57F17',
    },
    noticeDate: {
        fontSize: 12,
        color: '#666',
    },
    noticeMessage: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    noticeAuthor: {
        textAlign: 'right',
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.l,
        width: '100%',
        ...SHADOWS.card,
    },
    modalHeader: {
        marginBottom: SPACING.m,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    purposeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    purposeChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 8,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: '#F5F5F5',
    },
    activePurposeChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    purposeText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    activePurposeText: {
        color: COLORS.surface,
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SPACING.m,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: SPACING.m,
    },
    cancelBtnText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    confirmBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: SPACING.l,
        borderRadius: RADIUS.m,
    },
    confirmBtnText: {
        color: COLORS.surface,
        fontWeight: '600',
    },
    // Slot Selection Styles
    slotSelectionList: {
        maxHeight: 250,
        marginVertical: SPACING.m,
    },
    slotSelectionChip: {
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedSlotChip: {
        borderColor: COLORS.primary,
        backgroundColor: '#E3F2FD',
    },
    disabledSlotChip: {
        backgroundColor: '#F5F5F5',
        borderColor: 'transparent',
        opacity: 0.6,
    },
    slotChipText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    selectedSlotChipText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    disabledSlotChipText: {
        color: COLORS.textSecondary,
    },

    // Profile Modal Styles
    profileModalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 32,
        width: '85%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 10,
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    largeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    largeAvatarText: {
        color: COLORS.surface,
        fontSize: 40,
        fontWeight: 'bold',
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
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: -4, // Optical adjustment for icon
    },
});
