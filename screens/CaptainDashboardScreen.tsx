import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CaptainHomeScreen } from './CaptainHomeScreen';
import { CaptainBookingsScreen } from './CaptainBookingsScreen';
import { CaptainTeamScreen } from './CaptainTeamScreen';
import { CaptainProfileScreen } from './CaptainProfileScreen';
import { COLORS } from '../theme';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

import { Ionicons } from '@expo/vector-icons';

// Simple Icon component helper using Ionicons
const TabIcon = ({ focused, label }: { focused: boolean; label: string }) => {
    let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

    if (label === 'Schedule') {
        iconName = focused ? 'calendar' : 'calendar-outline';
    } else if (label === 'My Bookings') {
        iconName = focused ? 'ticket' : 'ticket-outline';
    } else if (label === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', top: 4 }}>
            <Ionicons name={iconName} size={24} color={focused ? COLORS.primary : COLORS.textSecondary} />
        </View>
    );
};

export const CaptainDashboardScreen: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} label={route.name} />
                ),
            })}
        >
            <Tab.Screen name="Schedule" component={CaptainHomeScreen} />
            <Tab.Screen name="My Bookings" component={CaptainBookingsScreen} />
            <Tab.Screen name="Profile" component={CaptainProfileScreen} />
        </Tab.Navigator>
    );
};
