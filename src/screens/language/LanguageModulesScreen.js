import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Exemple de données de modules (qui viendront plus tard de votre API .NET)
const MODULES_DATA = [
  { id: '1', title: 'Module 1 : Salutations et Politesse', duration: '5 min', isCompleted: true, isUnlocked: true },
  { id: '2', title: 'Module 2 : Se présenter à un guichet', duration: '7 min', isCompleted: false, isUnlocked: true },
  { id: '3', title: 'Module 3 : Prendre un rendez-vous médical', duration: '6 min', isCompleted: false, isUnlocked: false },
  { id: '4', title: 'Module 4 : Vocabulaire de l\'administration', duration: '8 min', isCompleted: false, isUnlocked: false },
];

export default function LanguageModulesScreen({ navigation }) {
  const [modules, setModules] = useState(MODULES_DATA);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isUnlocked && styles.cardLocked]}
      disabled={!item.isUnlocked}
      onPress={() => navigation.navigate('ModuleDetail', { module: item })}
    >
      <View style={styles.iconContainer}>
        {item.isCompleted ? (
          <Ionicons name="checkmark-circle" size={28} color="#2E7D32" />
        ) : item.isUnlocked ? (
          <Ionicons name="play-circle" size={28} color="#1E88E5" />
        ) : (
          <Ionicons name="lock-closed" size={24} color="#9E9E9E" />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, !item.isUnlocked && styles.textLocked]}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>Durée estimée : {item.duration}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={item.isUnlocked ? '#1E88E5' : '#9E9E9E'} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Parcours de Français</Text>
      <Text style={styles.headerSubtitle}>Suivez les cours, réussissez les quiz pour débloquer la suite.</Text>

      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: '#666', marginBottom: 20 },
  listContainer: { paddingBottom: 20 },
  card: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardLocked: { backgroundColor: '#E0E0E0', elevation: 0 },
  iconContainer: { marginRight: 14 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  textLocked: { color: '#757575' },
  cardSubtitle: { fontSize: 12, color: '#666' },
});