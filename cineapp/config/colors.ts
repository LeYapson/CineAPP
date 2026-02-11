// Palette de couleurs pour CineAPP - Thème cinématographique

export const colors = {
  // Couleurs principales
  primary: {
    50: '#f0f7ff',
    100: '#e0f0fe',
    200: '#bae0fd',
    300: '#7ccfff',
    400: '#3abff8',
    500: '#0ea5e9',  // Bleu principal
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Couleurs secondaires (or/doré pour le cinéma)
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',  // Jaune/or principal
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Couleurs neutres
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Couleurs de fond
  background: {
    light: '#f8f9fa',
    dark: '#0f172a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  },
  
  // Couleurs pour les genres de films
  genres: {
    action: '#ef4444',      // Rouge
    comedy: '#f59e0b',      // Orange
    drama: '#10b981',       // Vert
    thriller: '#6366f1',    // Indigo
    horror: '#7c2d12',      // Rouge foncé
    scifi: '#06b6d4',       // Cyan
    romance: '#ec4899',     // Rose
    animation: '#f97316',   // Orange vif
    documentary: '#14b8a6', // Turquoise
  },
  
  // Couleurs pour les statuts
  status: {
    confirmed: '#10b981',   // Vert
    pending: '#f59e0b',     // Orange
    cancelled: '#ef4444',   // Rouge
  },
};

export const theme = {
  light: {
    background: colors.background.light,
    text: colors.gray[900],
    card: '#ffffff',
    border: colors.gray[200],
  },
  dark: {
    background: colors.background.dark,
    text: colors.gray[100],
    card: colors.gray[800],
    border: colors.gray[700],
  },
};
