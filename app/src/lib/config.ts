// Configuration for the application
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 30000, // 30 seconds
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Mental Health Chat',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    defaultUserId: 'default-user',
  },

  // Chat Configuration
  chat: {
    maxMessageLength: 1000,
    typingIndicatorDelay: 1000, // 1 second
    messageRetryAttempts: 3,
  },

  // UI Configuration
  ui: {
    theme: 'light', // or 'dark'
    language: 'en',
    dateFormat: 'en-US',
  }
};

// Environment check
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

export function isProduction(): boolean {
  return import.meta.env.PROD;
}

// API URL builder
export function buildApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}${endpoint}`;
} 