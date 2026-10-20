import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://hirondelle-api.onrender.com/api';

export default function ProfileScreen({ user, onLogout }) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Fonction effectuant la suppression côté API et le nettoyage local
  const executeAccountDeletion = async () => {
    try {
      setLoadingDelete(true);
      const response = await fetch(`${API_BASE_URL}/auth/user/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await AsyncStorage.removeItem('userSession');
        if (Platform.OS === 'web') {
          alert("Votre compte a bien été supprimé.");
        } else {
          Alert.alert("Compte supprimé", "Votre compte a bien été supprimé.");
        }
        if (onLogout) onLogout();
      } else {
        const data = await response.json();
        const err = data.message || "Impossible de supprimer le compte.";
        if (Platform.OS === 'web') alert(err);
        else Alert.alert("Erreur", err);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      const msg = "Impossible de contacter le serveur distant.";
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert("Erreur", msg);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Demande de confirmation avant suppression
  const handleDeleteAccount = () => {
    if (!user || !user.id) {
      const msg = "Identifiant utilisateur introuvable.";
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert("Erreur", msg);
      return;
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.");
      if (confirmed) {
        executeAccountDeletion();
      }
    } else {
      Alert.alert(
        "Suppression définitive",
        "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Supprimer", 
            style: "destructive", 
            onPress: executeAccountDeletion 
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#1E88E5" />
        </View>
        <Text style={styles.name}>{user?.fullName || "Utilisateur"}</Text>
        <Text style={styles.email}>{user?.email || "email@example.com"}</Text>
      </View>

      <View style={styles.menuContainer}>
        {/* Bouton Se déconnecter */}
        <TouchableOpacity style={styles.menuButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#1E88E5" />
          <Text style={styles.menuText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* Bouton Supprimer mon compte */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={loadingDelete}>
          {loadingDelete ? (
            <ActivityIndicator color="#C62828" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#C62828" />
              <Text style={styles.deleteText}>Supprimer mon compte</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20, justifyContent: 'center', alignItems: 'center' },
  headerCard: { backgroundColor: '#FFF', width: '100%', maxWidth: 500, padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 20, elevation: 2 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 14, color: '#666' },
  menuContainer: { width: '100%', maxWidth: 500, gap: 12 },
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, elevation: 1 },
  menuText: { fontSize: 16, color: '#1E88E5', fontWeight: '600', marginLeft: 12 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 16, borderRadius: 12, elevation: 1 },
  deleteText: { fontSize: 16, color: '#C62828', fontWeight: '600', marginLeft: 12 },
});