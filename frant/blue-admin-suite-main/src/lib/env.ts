// Configuration des variables d'environnement
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/',
  APP_NAME: 'Gestion des Utilisateurs',
  VERSION: '1.0.0',
};

// Validation des variables d'environnement requises
const requiredEnvVars = [] as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`);
  }
}