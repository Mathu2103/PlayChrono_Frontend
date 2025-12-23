import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

interface Captain {
    id: string;
    username: string; // "name"
    email: string;
    role: string;
    sport: string;
    teamName: string;
}

export const AdminUsersListScreen = () => {
    const navigation = useNavigation<any>();
    const [captains, setCaptains] = useState<Captain[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCaptains = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/captains`);
            const data = await response.json();
            if (data.success) {
                setCaptains(data.captains);
            } else {
                Alert.alert("Error", "Failed to fetch captains.");
            }
        } catch (error) {
            console.error("Error fetching captains:", error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaptains();
    }, []);

    const renderItem = ({ item }: { item: Captain }) => (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.detailsRow}>
                    <Text style={styles.detailText}>Sport: {item.sport || 'N/A'}</Text>
                    <Text style={styles.detailText}>Team: {item.teamName || 'N/A'}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registered Captains</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={captains}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>No captains found.</Text>
                        </View>
                    }
                />
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    listContent: {
        padding: SPACING.m,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderRadius: RADIUS.m,
        ...SHADOWS.card,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    email: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        padding: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        gap: 10,
    },
    detailText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '500',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});
