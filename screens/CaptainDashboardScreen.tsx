import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CaptainHomeScreen } from './CaptainHomeScreen';
import { CaptainBookingsScreen } from './CaptainBookingsScreen';
import { CaptainTeamScreen } from './CaptainTeamScreen';
import { CaptainProfileScreen } from './CaptainProfileScreen';
import { COLORS } from '../theme';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

// Simple Icon component helper since we don't have vector icons set up yet
const TabIcon = ({ focused, label }: { focused: boolean; label: string }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
                {label === 'Home' && '🏠'}
                {label === 'Book' && '📅'}
                {label === 'Team' && '👥'}
                {label === 'Profile' && '👤'}
            </Text>
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
            <Tab.Screen name="Home" component={CaptainHomeScreen} />
            <Tab.Screen name="Book" component={CaptainBookingsScreen} />
            <Tab.Screen name="Team" component={CaptainTeamScreen} />
            <Tab.Screen name="Profile" component={CaptainProfileScreen} />
        </Tab.Navigator>
    );
};
