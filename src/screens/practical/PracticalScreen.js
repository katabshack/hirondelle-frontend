import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PracticalScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="information-circle-outline" size={50} color="#1E88E5" />
        <Text style={styles.title}>Infos Pratiques & Contact</Text>
        <Text style={styles.subtitle}>Retrouvez-nous et soutenez nos actions</Text>
      </View>

      {/* Carte Coordonnées */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Coordonnées du Foyer</Text>
        
        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('tel:+41266843311')}>
          <Ionicons name="call-outline" size={22} color="#1E88E5" />
          <Text style={styles.itemText}>+41 26 684 33 11</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('tel:+41794281320')}>
          <Ionicons name="phone-portrait-outline" size={22} color="#1E88E5" />
          <Text style={styles.itemText}>+41 79 428 13 20</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('mailto:contact@foyer-hirondelle.ch')}>
          <Ionicons name="mail-outline" size={22} color="#1E88E5" />
          <Text style={styles.itemText}>contact@foyer-hirondelle.ch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.foyer-hirondelle.ch')}>
          <Ionicons name="globe-outline" size={22} color="#1E88E5" />
          <Text style={styles.itemText}>www.foyer-hirondelle.ch</Text>
        </TouchableOpacity>

        <View style={styles.item}>
          <Ionicons name="location-outline" size={22} color="#1E88E5" />
          <Text style={styles.itemText}>Route de la Glâne 161, 1752 Villars-sur-Glâne</Text>
        </View>
      </View>

      {/* Carte Soutien / Dons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actions Solidaires & Dons</Text>
        <Text style={styles.cardDescription}>
          Contribuez à soutenir nos projets intergénérationnels et l'accompagnement des personnes fragiles.
        </Text>

        <View style={styles.ibanBox}>
          <Text style={styles.ibanLabel}>IBAN Raiffeisen :</Text>
          <Text style={styles.ibanValue}>CH69 8080 8006 0271 3712 4</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E88E5', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#666' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, width: '100%', maxWidth: 600, elevation: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  cardDescription: { fontSize: 13, color: '#666', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  itemText: { fontSize: 14, color: '#333', marginLeft: 12, fontWeight: '500' },
  ibanBox: { backgroundColor: '#F1F3F5', padding: 12, borderRadius: 8, marginTop: 8 },
  ibanLabel: { fontSize: 12, color: '#666' },
  ibanValue: { fontSize: 14, fontWeight: 'bold', color: '#1E88E5', marginTop: 2 },
});