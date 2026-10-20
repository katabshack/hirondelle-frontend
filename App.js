import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/home/HomeScreen';
import LanguageScreen from './src/screens/language/LanguageScreen';
import PracticeScreen from './src/screens/practical/PracticalScreen';
import JobScreen from './src/screens/jobs/JobsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';

const API_BASE_URL = 'https://hirondelle-api.onrender.com';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ['http://localhost:8082', 'exp://'],
  config: {
    screens: {
      Login: '',
      Register: 'register',
      ResetPassword: 'reset-password',
      MainApp: 'app',
    },
  },
};

function MainTabs({ user, onLogout }) {
  const currentUserId = user?.id ? user.id.toString() : "1";

  // Vérifier à chaque changement d'onglet si le compte existe toujours sur le serveur
  useEffect(() => {
    const verifyAccount = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify/${user.id}`);
        if (response.status === 404) {
          Alert.alert("Session expirée", "Ce compte a été supprimé.");
          onLogout();
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du compte :", error);
      }
    };

    verifyAccount();
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Langue') iconName = focused ? 'language' : 'language-outline';
          else if (route.name === 'Pratique') iconName = focused ? 'construct' : 'construct-outline';
          else if (route.name === 'Emploi') iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      
      <Tab.Screen name="Langue">
        {(props) => <LanguageScreen {...props} userId={currentUserId} />}
      </Tab.Screen>

      <Tab.Screen name="Pratique" component={PracticeScreen} />
      <Tab.Screen name="Emploi" component={JobScreen} />
      <Tab.Screen name="Profil">
        {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier la session au démarrage et si le compte existe toujours en BDD
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem('userSession');
        if (savedSession) {
          const parsedUser = JSON.parse(savedSession);
          if (parsedUser?.id) {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify/${parsedUser.id}`);
            if (response.status === 404) {
              await AsyncStorage.removeItem('userSession');
              setUser(null);
              setIsLoading(false);
              return;
            }
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session :", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleLoginSuccess = async (userData) => {
    try {
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session :", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la session :", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user == null ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen 
              name="ResetPassword" 
              component={ResetPasswordScreen} 
              options={{ headerShown: true, title: 'Nouveau mot de passe' }} 
            />
          </>
        ) : (
          <Stack.Screen name="MainApp">
            {(props) => <MainTabs {...props} user={user} onLogout={handleLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}