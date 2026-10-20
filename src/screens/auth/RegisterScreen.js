import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'https://hirondelle-api.onrender.com/api';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Inscription réussie ! Redirection...');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        setErrorMessage(data.message || data.Message || "Erreur lors de l'inscription.");
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
        <Ionicons name="person-add-outline" size={50} color="#1E88E5" style={{ alignSelf: 'center', marginBottom: 20 }} />
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez l'espace Foyer L'Hirondelle</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
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

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 15 }}>
          <Text style={styles.linkText}>Déjà un compte ? <Text style={{ color: '#1E88E5', fontWeight: 'bold' }}>Se connecter</Text></Text>
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
  linkText: { textAlign: 'center', color: '#666', fontSize: 13 },
});