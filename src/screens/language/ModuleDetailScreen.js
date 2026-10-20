import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ModuleDetailScreen({ route, navigation }) {
  const { module } = route.params || { title: 'Leçon de français' };

  // États pour le Quiz interactif (exemple de questions)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Exemple de question de quiz pour ce module
  const quiz = {
    question: "Quelle expression utilise-t-on poliment pour demander une consultation ?",
    options: [
      "Je veux voir un médecin tout de suite.",
      "J’ai besoin d’un rendez-vous, s'il vous plaît.",
      "Donnez-moi un médicament.",
    ],
    correctIndex: 1,
  };

  const handleValidateQuiz = () => {
    if (selectedAnswer === null) {
      Alert.alert("Attention", "Veuillez sélectionner une réponse.");
      return;
    }

    setQuizSubmitted(true);
    if (selectedAnswer === quiz.correctIndex) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.moduleTitle}>{module.title}</Text>

      {/* Zone de la vidéo YouTube (Simulée pour l'instant avec un encadré visuel) */}
      <View style={styles.videoContainer}>
        <Ionicons name="logo-youtube" size={50} color="#FF0000" />
        <Text style={styles.videoPlaceholderText}>[ Lecteur Vidéo YouTube ]</Text>
        <Text style={styles.videoSubText}>Regardez la vidéo ci-dessus avant de passer au quiz.</Text>
      </View>

      {/* Section Quiz */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>Quiz de validation</Text>
        <Text style={styles.questionText}>{quiz.question}</Text>

        {quiz.options.map((option, index) => {
          let optionStyle = styles.optionButton;
          if (selectedAnswer === index) {
            optionStyle = [styles.optionButton, styles.optionSelected];
          }
          if (quizSubmitted) {
            if (index === quiz.correctIndex) {
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
            <Text style={styles.validateButtonText}>Valider mes réponses</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, isCorrect ? styles.textSuccess : styles.textError]}>
              {isCorrect ? "🎉 Bravo ! Réponse correcte. Module validé !" : "❌ Oups, ce n'est pas la bonne réponse. Réessayez !"}
            </Text>
            {isCorrect && (
              <TouchableOpacity style={styles.nextModuleButton} onPress={() => navigation.goBack()}>
                <Text style={styles.nextButtonText}>Continuer vers le module suivant</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20 },
  moduleTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  videoContainer: { backgroundColor: '#000', height: 200, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  videoPlaceholderText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  videoSubText: { color: '#AAA', fontSize: 12, marginTop: 4 },
  quizContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 2 },
  quizHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5', marginBottom: 10 },
  questionText: { fontSize: 15, color: '#333', marginBottom: 15, fontWeight: '500' },
  optionButton: { backgroundColor: '#F1F3F5', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  optionSelected: { backgroundColor: '#E3F2FD', borderColor: '#1E88E5' },
  optionCorrect: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  optionIncorrect: { backgroundColor: '#FFEBEE', borderColor: '#C62828' },
  optionText: { fontSize: 14, color: '#333' },
  validateButton: { backgroundColor: '#1E88E5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  validateButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  resultContainer: { marginTop: 15, alignItems: 'center' },
  resultText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  textSuccess: { color: '#2E7D32' },
  textError: { color: '#C62828' },
  nextModuleButton: { backgroundColor: '#2E7D32', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%', marginTop: 5 },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});