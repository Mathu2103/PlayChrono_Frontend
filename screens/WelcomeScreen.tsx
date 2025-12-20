import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar style="dark" />

            {/* Header / Logo */}
            <View style={styles.header}>
                {/* Emoji removed as requested */}
                <Text style={styles.logoText}>PlayChrono</Text>
            </View>

            <View style={styles.content}>
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/hero-image.jpg')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.headline}>
                        Book Your Turf{'\n'}
                        <Text style={styles.highlight}>in Seconds</Text>
                    </Text>
                    <Text style={styles.bodyText}>
                        The easiest way to book university grounds and manage your sports schedule. Never miss a game.
                    </Text>
                </View>


                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Create Account  →"
                        onPress={() => navigation.navigate('SignUp')}
                        style={styles.primaryButton}
                    />


                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.loginLink}>I have an account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.l,
        justifyContent: 'space-evenly',
        paddingBottom: SPACING.l,
    },
    imageContainer: {
        width: '100%',
        height: width * 0.75, // Slightly adjust aspect ratio
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    headline: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 40,
    },
    highlight: {
        color: COLORS.primary,
    },
    bodyText: {
        marginTop: SPACING.m,
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: SPACING.s,
    },
    actions: {
        width: '100%',
        gap: SPACING.m,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        height: 54,
        borderRadius: RADIUS.l,
        backgroundColor: COLORS.primary,
    },
    loginLink: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontWeight: '500',
        marginTop: SPACING.xs,
    },
});
