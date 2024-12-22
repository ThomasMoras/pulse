export const dateToTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Fonction utilitaire pour convertir un timestamp en date lisible
export const formatBirthDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

// Fonction utilitaire pour calculer l'âge
export const calculateAge = (birthDate: number): number => {
  const now = new Date();
  const birth = new Date(birthDate * 1000);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
