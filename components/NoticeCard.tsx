import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Notice } from '../types';

interface NoticeCardProps {
    notice: Notice;
    onPress: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
    const getPriorityColor = () => {
        switch (notice.priority) {
            case 'Urgent': return '#d32f2f';
            case 'Important': return '#ffc107';
            case 'General': return '#388e3c';
            default: return COLORS.textSecondary;
        }
    };

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                    <Text style={styles.priorityText}>{notice.priority.toUpperCase()}</Text>
                </View>
                {notice.targetAudience !== 'All' && (
                    <View style={styles.sportBadge}>
                        <Text style={styles.sportText}>{notice.targetAudience}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.title} numberOfLines={2}>{notice.title}</Text>
            <Text style={styles.message} numberOfLines={3}>{notice.message}</Text>

            <View style={styles.footer}>
                <Text style={styles.author}>By: {notice.createdBy.name}</Text>
                <Text style={styles.time}>{getTimeAgo(notice.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.card,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    priorityBadge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
        marginRight: SPACING.s,
    },
    priorityText: {
        color: COLORS.surface,
        fontSize: 10,
        fontWeight: '700',
    },
    sportBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    sportText: {
        color: COLORS.surface,
        fontSize: 10,
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    message: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: SPACING.s,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    author: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    time: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
});
