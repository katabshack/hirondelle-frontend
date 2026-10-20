import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useIsFocused } from '@react-navigation/native';

const API_BASE_URL = 'https://hirondelle-api.onrender.com';

export default function LanguageScreen({ route, userId: propUserId }) {
  // Détection du focus de l'écran et récupération prioritaire de la prop userId
  const isFocused = useIsFocused();
  const userId = propUserId || route?.params?.userId || "1";

  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeModule, setActiveModule] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Recharger la progression automatiquement quand l'écran gagne le focus ou que le userId change
  useEffect(() => {
    if (isFocused && userId) {
      fetchData();
    }
  }, [isFocused, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Récupération des modules et de leurs questions
      const modulesRes = await fetch(`${API_BASE_URL}/api/language/modules`);
      const modulesData = await modulesRes.json();

      // 2. Récupération de la progression propre à l'utilisateur connecté
      const progressRes = await fetch(`${API_BASE_URL}/api/language/progress/${userId}`);
      const progressData = await progressRes.json();

      setModules(modulesData);
      setUserProgress(progressData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      Alert.alert("Erreur", "Impossible de charger les cours depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModule = (mod) => {
    setActiveModule(mod);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setIsCorrect(false);
  };

  const handleValidateQuiz = () => {
    if (selectedAnswer === null) {
      Alert.alert("Attention", "Veuillez sélectionner une réponse.");
      return;
    }

    const currentQuestion = activeModule.questions?.[0];
    if (!currentQuestion) return;

    setQuizSubmitted(true);
    if (selectedAnswer === currentQuestion.correctIndex) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleCompleteModule = async () => {
    try {
      // Enregistrement de la progression sur le backend pour cet utilisateur
      const response = await fetch(`${API_BASE_URL}/api/language/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          languageModuleId: activeModule.id
        })
      });

      if (response.ok) {
        // Recharger la progression mise à jour
        const progressRes = await fetch(`${API_BASE_URL}/api/language/progress/${userId}`);
        const progressData = await progressRes.json();
        setUserProgress(progressData);

        setActiveModule(null);
        Alert.alert("Succès 🎉", "Module validé et enregistré en base de données !");
      } else {
        Alert.alert("Erreur", "Impossible d'enregistrer la progression.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ marginTop: 12, color: '#666' }}>Chargement des cours...</Text>
      </View>
    );
  }

  // --- VUE DÉTAIL DU COURS ---
  if (activeModule) {
    const currentQuestion = activeModule.questions?.[0] || { questionText: "", options: [] };

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.centeredWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveModule(null)}>
            <Ionicons name="arrow-back" size={20} color="#1E88E5" />
            <Text style={styles.backButtonText}>Retour aux modules</Text>
          </TouchableOpacity>

          <Text style={styles.moduleTitle}>{activeModule.title}</Text>
          <Text style={styles.moduleDesc}>{activeModule.description}</Text>

          {/* Lecteur Vidéo YouTube (Web vs Mobile) */}
          <View style={styles.videoContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                width="100%"
                height="220"
                src={`https://www.youtube.com/embed/${activeModule.youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 12, border: 'none' }}
              />
            ) : (
              <YoutubePlayer
                height={220}
                play={false}
                videoId={activeModule.youtubeId}
              />
            )}
          </View>

          {/* Section Quiz interactif */}
          <View style={styles.quizCard}>
            <Text style={styles.quizHeader}>✍️ Quiz de validation</Text>
            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

            {currentQuestion.options.map((option, index) => {
              let optionStyle = styles.optionButton;
              if (selectedAnswer === index) {
                optionStyle = [styles.optionButton, styles.optionSelected];
              }
              if (quizSubmitted) {
                if (index === currentQuestion.correctIndex) {
                  optionStyle = [styles.optionButton, styles.optionCorrect];
                } else if (selectedAnswer === index && !isCorrect) {
                  optionStyle = [styles.optionButton, styles.optionIncorrect];
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  disabled={quizSubmitted}
                  onPress={() => setSelectedAnswer(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}

            {!quizSubmitted ? (
              <TouchableOpacity style={styles.validateButton} onPress={handleValidateQuiz}>
                <Text style={styles.validateButtonText}>Valider ma réponse</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.resultContainer}>
                <Text style={[styles.resultText, isCorrect ? styles.textSuccess : styles.textError]}>
                  {isCorrect ? "🎉 Bravo ! Bonne réponse." : "❌ Oups, ce n'est pas la bonne réponse. Réessayez !"}
                </Text>
                {isCorrect ? (
                  <TouchableOpacity style={styles.nextButton} onPress={handleCompleteModule}>
                    <Text style={styles.nextButtonText}>Enregistrer et terminer</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.retryButton} onPress={() => { setQuizSubmitted(false); setSelectedAnswer(null); }}>
                    <Text style={styles.retryButtonText}>Recommencer le quiz</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  // --- VUE LISTE DES MODULES ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.centeredWrapper}>
        <View style={styles.header}>
          <Ionicons name="school-outline" size={32} color="#1E88E5" />
          <Text style={styles.headerTitle}>Parcours de Français</Text>
          <Text style={styles.headerSubtitle}>
            Suivez les cours vidéo et réussissez les quiz pour progresser, niveau par niveau.
          </Text>
        </View>

        <View style={styles.cardsList}>
          {modules.map((item, index) => {
            const progressRecord = userProgress.find(p => p.languageModuleId === item.id);
            const isCompleted = progressRecord ? progressRecord.isCompleted : false;

            // Logique de déblocage séquentiel
            const isPreviousCompleted = index === 0 || (() => {
              const prevModule = modules[index - 1];
              const prevProgress = userProgress.find(p => p.languageModuleId === prevModule?.id);
              return prevProgress ? prevProgress.isCompleted : false;
            })();
            const isUnlocked = index === 0 || isPreviousCompleted;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !isUnlocked && styles.cardLocked]}
                disabled={!isUnlocked}
                onPress={() => handleSelectModule(item)}
              >
                <View style={styles.iconContainer}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={28} color="#2E7D32" />
                  ) : isUnlocked ? (
                    <Ionicons name="play-circle" size={28} color="#1E88E5" />
                  ) : (
                    <Ionicons name="lock-closed" size={24} color="#9E9E9E" />
                  )}
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, !isUnlocked && styles.textLocked]}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>Durée : {item.duration}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={isUnlocked ? '#1E88E5' : '#9E9E9E'} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  centeredWrapper: { width: '100%', maxWidth: 750, alignSelf: 'center' },
  header: { marginBottom: 20, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, alignItems: 'center', width: '100%' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E88E5', marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 4 },
  cardsList: { gap: 12, width: '100%' },
  card: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, elevation: 1, width: '100%' },
  cardLocked: { backgroundColor: '#E9ECEF', opacity: 0.7 },
  iconContainer: { marginRight: 14 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
  textLocked: { color: '#6C757D' },
  cardSubtitle: { fontSize: 12, color: '#666' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 4 },
  backButtonText: { color: '#1E88E5', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  moduleTitle: { fontSize: 20, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  moduleDesc: { fontSize: 14, color: '#666', marginBottom: 16 },
  videoContainer: { width: '100%', borderRadius: 14, overflow: 'hidden', backgroundColor: '#000', marginBottom: 20 },
  quizCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 14, elevation: 1, width: '100%' },
  quizHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5', marginBottom: 10 },
  questionText: { fontSize: 15, color: '#333', marginBottom: 16, fontWeight: '500' },
  optionButton: { backgroundColor: '#F1F3F5', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  optionSelected: { backgroundColor: '#E3F2FD', borderColor: '#1E88E5' },
  optionCorrect: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  optionIncorrect: { backgroundColor: '#FFEBEE', borderColor: '#C62828' },
  optionText: { fontSize: 14, color: '#333' },
  validateButton: { backgroundColor: '#1E88E5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  validateButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  resultContainer: { marginTop: 15, alignItems: 'center' },
  resultText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  textSuccess: { color: '#2E7D32' },
  textError: { color: '#C62828' },
  nextButton: { backgroundColor: '#2E7D32', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  retryButton: { backgroundColor: '#6C757D', padding: 12, borderRadius: 10, alignItems: 'center', width: '100%' },
  retryButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});