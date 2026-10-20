import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JobsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="briefcase-outline" size={50} color="#1E88E5" />
        <Text style={styles.title}>Insertion & Emploi</Text>
        <Text style={styles.subtitle}>Opportunités professionnelles et accompagnement</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Programme d'intégration directe</Text>
        <Text style={styles.infoText}>
          Le Foyer L'Hirondelle propose des opportunités d'insertion visant à accompagner l'intégration professionnelle (notamment pour les travailleurs issus de l'immigration européenne profitant de la libre circulation).
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Offres de Contrat Disponibles</Text>

      <View style={styles.jobCard}>
        <View style={styles.badge}><Text style={styles.badgeText}>Durée : 6 mois</Text></View>
        <Text style={styles.jobTitle}>Accompagnant·e Foyer & Animation</Text>
        <Text style={styles.jobDetail}><Ionicons name="cash-outline" size={16} /> Coût / Cadre : 4'000 CHF</Text>
        <Text style={styles.jobDetail}><Ionicons name="time-outline" size={16} /> Type : Contrat de travail (Secteur Médico-Social)</Text>
        <Text style={styles.jobDescription}>
          Participez aux activités intergénérationnelles, à l'accueil de jour des bénéficiaires et à la convivialité du foyer.
        </Text>
      </View>

      <View style={styles.jobCard}>
        <View style={styles.badge}><Text style={styles.badgeText}>Durée : 6 mois</Text></View>
        <Text style={styles.jobTitle}>Soutien Logistique & Polyvalent</Text>
        <Text style={styles.jobDetail}><Ionicons name="cash-outline" size={16} /> Coût / Cadre : 4'000 CHF</Text>
        <Text style={styles.jobDetail}><Ionicons name="time-outline" size={16} /> Type : Contrat de travail</Text>
        <Text style={styles.jobDescription}>
          Assurez l'organisation matérielle, l'accueil des familles et le bon fonctionnement opérationnel des espaces de vie.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E88E5', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  infoBox: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12, marginBottom: 20, width: '100%', maxWidth: 600 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D47A1', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#1565C0', lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start', marginBottom: 12 },
  jobCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 15, width: '100%', maxWidth: 600, elevation: 1 },
  badge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  badgeText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  jobDetail: { fontSize: 13, color: '#666', marginBottom: 4 },
  jobDescription: { fontSize: 13, color: '#444', marginTop: 8, lineHeight: 18 },
});