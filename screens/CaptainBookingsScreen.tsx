import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

// Mock Data
const DATES = [
    { day: 'Mon', date: '15' },
    { day: 'Tue', date: '16' },
    { day: 'Wed', date: '17', active: true },
    { day: 'Thu', date: '18' },
    { day: 'Fri', date: '19' },
    { day: 'Sat', date: '20' },
    { day: 'Sun', date: '21' },
];

const GAMES = [
    { id: '1', sport: 'Football', ground: 'Main Turf A', time: '4:00 PM', price: '$20', status: 'Available' },
    { id: '2', sport: 'Basketball', ground: 'Indoor Court 1', time: '5:00 PM', price: '$15', status: 'Booked' },
    { id: '3', sport: 'Tennis', ground: 'Clay Court', time: '5:30 PM', price: '$10', status: 'Available' },
    { id: '4', sport: 'Football', ground: 'Main Turf B', time: '6:00 PM', price: '$20', status: 'Available' },
    { id: '5', sport: 'Cricket', ground: 'Oval Ground', time: '7:00 PM', price: '$30', status: 'Fast Filling' },
];

const CATEGORIES = ['All', 'Football', 'Basketball', 'Cricket', 'Tennis'];

export const CaptainBookingsScreen: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const renderDateItem = (item: any, index: number) => (
        <TouchableOpacity
            key={index}
            style={[styles.dateItem, item.active && styles.activeDateItem]}
        >
            <Text style={[styles.dayText, item.active && styles.activeDateText]}>{item.day}</Text>
            <Text style={[styles.dateText, item.active && styles.activeDateText]}>{item.date}</Text>
        </TouchableOpacity>
    );

    const renderGameCard = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.sportTag}>{item.sport}</Text>
                <Text style={[
                    styles.statusText,
                    item.status === 'Available' ? styles.statusAvailable :
                        item.status === 'Booked' ? styles.statusBooked : styles.statusFilling
                ]}>
                    {item.status}
                </Text>
            </View>

            <Text style={styles.groundName}>{item.ground}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <Text style={styles.icon}>🕒</Text>
                    <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.icon}>💰</Text>
                    <Text style={styles.infoText}>{item.price}/hr</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.bookButton,
                    item.status === 'Booked' && styles.disabledButton
                ]}
                disabled={item.status === 'Booked'}
            >
                <Text style={styles.bookButtonText}>
                    {item.status === 'Booked' ? 'Unavailable' : 'Book Now'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper style={styles.screen}>
            {/* Calendar Strip */}
            <View style={styles.calendarContainer}>
                <Text style={styles.sectionTitle}>December 2025</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesList}>
                    {DATES.map(renderDateItem)}
                </ScrollView>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.filterPill, selectedCategory === cat && styles.activePill]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.filterText, selectedCategory === cat && styles.activeFilterText]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Games List */}
            <FlatList
                data={GAMES}
                renderItem={renderGameCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.gamesList}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F8F9FE',
    },
    calendarContainer: {
        paddingTop: SPACING.m,
        paddingBottom: SPACING.s,
        backgroundColor: COLORS.surface,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: SPACING.l,
        marginBottom: SPACING.m,
    },
    datesList: {
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
    },
    dateItem: {
        width: 50,
        height: 70,
        borderRadius: RADIUS.l,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    activeDateItem: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dayText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    activeDateText: {
        color: COLORS.surface,
    },
    filterContainer: {
        paddingVertical: SPACING.m,
    },
    filterList: {
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
    },
    filterPill: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 8,
        borderRadius: RADIUS.l,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activePill: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeFilterText: {
        color: COLORS.surface,
    },
    gamesList: {
        padding: SPACING.l,
        gap: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    sportTag: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statusAvailable: { color: COLORS.success },
    statusBooked: { color: COLORS.textSecondary },
    statusFilling: { color: '#FF9800' },

    groundName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    cardFooter: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        gap: SPACING.l,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 14,
        marginRight: 6,
    },
    infoText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    bookButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: RADIUS.m,
        paddingVertical: 12,
        alignItems: 'center',
    },
    disabledButton: {
        borderColor: COLORS.border,
        backgroundColor: '#F5F5F5',
    },
    bookButtonText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});
