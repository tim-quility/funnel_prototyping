export interface Theme {
  id: string;
  name: string;
  colors: {
    [key: string]: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default-mint',
    name: 'Double Mint',
    colors: {
      'quility-default': '#45bcaa', // Medium color, used as main accent
      'quility-dark-green': '#005851', // Dark color, as requested
      'quility-extra-dark-green': '#003e3a',
      'quility-medium-dark-green': '#45bcaa', // Medium color, for sidebar background
      'quility-button': '#44bbaa',
      'quility-button-hover': '#005751',
      'quility-sidebar': '#45bcaa', // Ensure this uses the medium color
      'quility-light-bg': '#cbfbef', // Light color, for selected sidebar item background
      'quility-accent-bg': '#f1f1f1', // Off-white, for general accent backgrounds
      'quility-light-text': '#f1f1f1', // Off-white for general light text on dark backgrounds
      'quility-dark-text': '#000000', // Keep dark text as black
      'quility-destructive': '#f95951',
      'quility-destructive-hover': '#b20221',
      'background': '#e4e4e4',
      'secondary': '#c5d9f0',
      'quility-light-green': '#cbfbef',
      'quility-light-hover': '#cbfbef',
    }
  },
  {
    id: 'oceanic-blue',
    name: 'Oceanic Blue',
    colors: {
      'quility-default': '#3b82f6',
      'quility-dark-green': '#1e40af',
      'quility-light-bg': '#eef2ff',
      'quility-extra-dark-green': '#1e3a8a',
      'quility-button': '#3b82f6',
      'quility-button-hover': '#2563eb',
      'quility-sidebar': '#1e40af',
      'quility-destructive': '#ef4444',
      'quility-destructive-hover': '#b91c1c',
      'background': '#eef2ff',
      'secondary': '#bfdbfe',
      'quility-light-green': '#adc0ff',
      'quility-light-hover': '#adc0ff',
    }
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    colors: {
      'quility-default': '#f97316',
      'quility-dark-green': '#9a3412',
      'quility-extra-dark-green': '#7c2d12',
      'quility-button': '#f97316',
      'quility-light-bg': '#fff7ed',
      'quility-button-hover': '#ea580c',
      'quility-sidebar': '#9a3412',
      'quility-destructive': '#ef4444',
      'quility-destructive-hover': '#b91c1c',
      'background': '#fff7ed',
      'secondary': '#fed7aa',
      'quility-light-green': '#ffd3bb',
       'quility-light-hover': '#ffd3bb',
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      'quility-default': '#16a34a',
      'quility-dark-green': '#14532d',
      'quility-extra-dark-green': '#164e2a',
      'quility-button': '#16a34a',
      'quility-light-bg': '#f0fdf4',
      'quility-button-hover': '#15803d',
      'quility-sidebar': '#14532d',
      'quility-destructive': '#f95951',
      'quility-destructive-hover': '#b20221',
      'background': '#f0fadf4',
      'secondary': '#bbf7d0',
      'quility-light-green': '#9fcdb0',
       'quility-light-hover': '#9fcdb0',
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colors: {
      'quility-default': '#8b5cf6',
      'quility-dark-green': '#5b21b6',
      'quility-extra-dark-green': '#4c1d95',
      'quility-button': '#8b5cf6',
      'quility-button-hover': '#7c3aed',
      'quility-sidebar': '#5b21b6',
      'quility-light-bg': '#f5f3ff',
      'quility-destructive': '#f95951',
      'quility-destructive-hover': '#b20221',
      'background': '#f5f3ff',
      'secondary': '#ddd6fe',
      'quility-light-green': '#cfbaff',
       'quility-light-hover': '#cfbaff',
    }
  }
];