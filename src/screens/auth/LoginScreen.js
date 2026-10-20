import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importation du logo (ajustez le chemin selon l'emplacement de votre fichier logo.png dans assets)
import logo from '../../../assets/logo.png';

const API_BASE_URL = 'https://hirondelle-api.onrender.com/api';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modale "Mot de passe oublié"
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // Connexion
  const handleLogin = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onLoginSuccess) onLoginSuccess(data.user);
      } else {
        setErrorMessage(data.message || 'Identifiants incorrects.');
      }
    } catch (error) {
      setErrorMessage('Impossible de contacter le serveur distant.');
    } finally {
      setLoading(false);
    }
  };

  // Demande de réinitialisation par e-mail
  const handleForgotPassword = async () => {
    setResetError('');
    setResetMessage('');
    if (!resetEmail) {
      setResetError('Veuillez entrer votre adresse e-mail.');
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetMessage(data.message || 'Un e-mail de réinitialisation vous a été envoyé.');
      } else {
        setResetError(data.message || 'Aucun compte associé à cet e-mail.');
      }
    } catch (error) {
      setResetError('Impossible de contacter le serveur distant.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Connectez-vous à votre espace</Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity style={styles.forgotContainer} onPress={() => {
          setResetError('');
          setResetMessage('');
          setForgotModalVisible(true);
        }}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Pas encore de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Modale Réinitialisation par E-mail */}
      <Modal visible={forgotModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mot de passe oublié</Text>
            <Text style={styles.modalSubtitle}>Entrez votre adresse e-mail. Un lien de réinitialisation vous sera envoyé.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Votre adresse e-mail"
              placeholderTextColor="#888"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {resetError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{resetError}</Text>
              </View>
            ) : null}

            {resetMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{resetMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword} disabled={resetLoading}>
              {resetLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Envoyer le lien</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setForgotModalVisible(false)}>
              <Text style={styles.cancelText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 220, height: 80, marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, elevation: 2 },
  input: { backgroundColor: '#F1F3F5', padding: 14, borderRadius: 10, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  errorContainer: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8, marginBottom: 12 },
  errorText: { color: '#C62828', fontSize: 13, textAlign: 'center' },
  successContainer: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 12 },
  successText: { color: '#2E7D32', fontSize: 13, textAlign: 'center' },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 15 },
  forgotText: { color: '#1E88E5', fontSize: 13, fontWeight: '600' },
  loginButton: { backgroundColor: '#1E88E5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  linkButton: { alignItems: 'center', marginTop: 20 },
  linkText: { color: '#666', fontSize: 14 },
  linkBold: { color: '#1E88E5', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  cancelButton: { alignItems: 'center', marginTop: 12, padding: 10 },
  cancelText: { color: '#E53935', fontWeight: '600' },
});