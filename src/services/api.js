const API_BASE_URL = 'https://hirondelle-api.onrender.com/api'; 

export const fetchAnnouncements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchAnnouncements:', error);
    return [];
  }
};

export const fetchVocabulary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchVocabulary:', error);
    return [];
  }
};

export const fetchJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchJobs:', error);
    return [];
  }
};