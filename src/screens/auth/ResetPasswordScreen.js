import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'https://hirondelle-api.onrender.com/api';

export default function ResetPasswordScreen({ route, navigation }) {
  // Récupération robuste du token (gère à la fois React Navigation et l'URL brute du navigateur web)
  const getToken = () => {
    if (route?.params?.token) return route.params.token;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    }
    return '';
  };

  const token = getToken();

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword) {
      setErrorMessage('Veuillez entrer un nouveau mot de passe.');
      return;
    }

    if (!token) {
      setErrorMessage('Token de réinitialisation introuvable ou invalide.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Votre mot de passe a été modifié avec succès !');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000); // Redirection automatique après 2 secondes vers la connexion
      } else {
        setErrorMessage(data.message || 'Le lien est invalide ou a expiré.');
      }
    } catch (error) {
      setErrorMessage('Impossible de contacter le serveur distant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Ionicons name="lock-closed-outline" size={50} color="#1E88E5" style={{ alignSelf: 'center', marginBottom: 20 }} />
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <Text style={styles.subtitle}>Entrez votre nouveau mot de passe ci-dessous.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          placeholderTextColor="#888"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Valider</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', padding: 20, alignItems: 'center' },
  form: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, width: '100%', maxWidth: 400, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#F1F3F5', padding: 14, borderRadius: 10, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  errorContainer: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8, marginBottom: 12 },
  errorText: { color: '#C62828', fontSize: 13, textAlign: 'center' },
  successContainer: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 12 },
  successText: { color: '#2E7D32', fontSize: 13, textAlign: 'center', fontWeight: 'bold' },
  button: { backgroundColor: '#1E88E5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});