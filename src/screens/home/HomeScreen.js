import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Importation du logo (ajustez le chemin selon votre structure de dossiers)
import logo from '../../../assets/logo.png';

const API_BASE_URL = 'https://hirondelle-api.onrender.com';

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les annonces à chaque fois que l'écran gagne le focus
  useEffect(() => {
    if (isFocused) {
      fetchAnnouncements();
    }
  }, [isFocused]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/announcements`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces :", error);
    } finally {
      setLoading(false);
    }
  };

  // Permet le glissement vers le bas pour rafraîchir manuellement
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E88E5']} />
      }
    >
      {/* En-tête avec le logo officiel */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Foyer de jour intergénérationnel</Text>
      </View>

      {/* Slogan */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          « Des journées qui font du bien, pour celles et ceux qui vieillissent et celles et ceux qui aiment leurs proches. »
        </Text>
      </View>

      {/* Section Annonces / Événements dynamiques */}
      <Text style={styles.sectionHeader}>Annonces & Événements</Text>
      {loading && !refreshing ? (
        <ActivityIndicator size="small" color="#1E88E5" style={{ marginBottom: 15 }} />
      ) : announcements.length > 0 ? (
        announcements.map((item) => (
          <View key={item.id} style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementCategory}>{item.category || 'Information'}</Text>
              <Text style={styles.announcementDate}>{item.date}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardDescription}>Aucune nouvelle annonce pour le moment.</Text>
        </View>
      )}

      {/* Cartes de présentation */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Qui sommes-nous ?</Text>
        <Text style={styles.cardDescription}>
          Association à but non lucratif créée en 2023, nous créons des espaces de vie chaleureux, humains et ouverts à toutes les générations.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notre Mission</Text>
        <View style={styles.bulletItem}>
          <Ionicons name="checkmark-circle" size={20} color="#1E88E5" style={styles.bulletIcon} />
          <Text style={styles.bulletText}>Offrir aux personnes âgées ou malades un lieu vivant, rassurant et convivial.</Text>
        </View>
        <View style={styles.bulletItem}>
          <Ionicons name="checkmark-circle" size={20} color="#1E88E5" style={styles.bulletIcon} />
          <Text style={styles.bulletText}>Soutenir les proches aidant·e·s grâce à des moments de répit mérité, sans culpabiliser.</Text>
        </View>
        <View style={styles.bulletItem}>
          <Ionicons name="checkmark-circle" size={20} color="#1E88E5" style={styles.bulletIcon} />
          <Text style={styles.bulletText}>Proposer une solution alternative entre le domicile et l'EMS pour les périodes de transition.</Text>
        </View>
      </View>

      {/* Piliers du Foyer */}
      <Text style={styles.sectionHeader}>Nos Engagements</Text>
      <View style={styles.grid}>
        <View style={styles.gridCard}>
          <Ionicons name="sunny-outline" size={32} color="#1E88E5" />
          <Text style={styles.gridTitle}>Accueil de jour & de nuit</Text>
        </View>
        <View style={styles.gridCard}>
          <Ionicons name="people-outline" size={32} color="#1E88E5" />
          <Text style={styles.gridTitle}>Contact humain & proximité</Text>
        </View>
        <View style={styles.gridCard}>
          <Ionicons name="hand-left-outline" size={32} color="#1E88E5" />
          <Text style={styles.gridTitle}>Accompagnement personnalisé</Text>
        </View>
        <View style={styles.gridCard}>
          <Ionicons name="happy-outline" size={32} color="#1E88E5" />
          <Text style={styles.gridTitle}>Partage, écoute & bien-être</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 15 },
  logo: { width: 240, height: 90, marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#666', fontStyle: 'italic' },
  banner: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12, marginBottom: 20, maxWidth: 600, width: '100%' },
  bannerText: { fontSize: 14, color: '#0D47A1', textAlign: 'center', fontWeight: '500' },
  card: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 15, width: '100%', maxWidth: 600, elevation: 1 },
  announcementCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 15, width: '100%', maxWidth: 600, elevation: 1, borderLeftWidth: 4, borderLeftColor: '#1E88E5' },
  announcementHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  announcementCategory: { fontSize: 12, fontWeight: 'bold', color: '#1E88E5', textTransform: 'uppercase' },
  announcementDate: { fontSize: 12, color: '#888' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  cardDescription: { fontSize: 14, color: '#555', lineHeight: 20 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletIcon: { marginRight: 8, marginTop: 2 },
  bulletText: { fontSize: 14, color: '#444', flex: 1, lineHeight: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 15, alignSelf: 'flex-start' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', maxWidth: 600 },
  gridCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, width: '48%', alignItems: 'center', marginBottom: 12, elevation: 1 },
  gridTitle: { fontSize: 13, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 8 },
});