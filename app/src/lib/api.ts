import { config } from './config';


export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Session {
  id: string;
  userId: string;
  sessionId: string;
  state?: Record<string, any>;
  messages?: ChatMessage[];
}

export class ADKApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL // 'http://localhost:8000';
  }

  /**
   * Create a new session with the ADK server
   */
  async createSession(userId: string = config.app.defaultUserId, sessionId?: string, state?: Record<string, any>): Promise<Session> {
    const sessionUUID = sessionId || this.generateSessionId();

    const response = await fetch(`${this.baseUrl}/apps/root_agent/users/${userId}/sessions/${sessionUUID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: state || {}
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    return {
      id: sessionUUID,
      userId,
      sessionId: sessionUUID,
      state: state || {},
      messages: []
    };
  }

  /**
   * Send a message to the agent using the /run endpoint
   */
  async sendMessage(sessionId: string, message: string, userId: string = config.app.defaultUserId): Promise<ChatMessage> {
    const response = await fetch(`${this.baseUrl}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'root_agent',
        userId: userId,
        sessionId: sessionId,
        newMessage: {
          role: 'user',
          parts: [{
            text: message
          }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the ADK response format to extract text content
    const textContent = this.extractTextFromResponse(data);

    return {
      id: data.id || Date.now().toString(),
      content: textContent || 'No response received',
      role: 'assistant',
      timestamp: new Date()
    };
  }

  /**
   * Extract text content from ADK response format
   */
  private extractTextFromResponse(response: any): string {
    if (!response || !Array.isArray(response)) {
      return 'No response received';
    }

    // Find the last message with text content
    for (let i = response.length - 1; i >= 0; i--) {
      const item = response[i];
      if (item.content && item.content.parts && Array.isArray(item.content.parts)) {
        for (const part of item.content.parts) {
          if (part.text) {
            return part.text;
          }
        }
      }
    }

    return 'No text response found';
  }

  /**
   * Get session messages
   */
  async getSessionMessages(sessionId: string, userId: string = config.app.defaultUserId): Promise<ChatMessage[]> {
    const response = await fetch(`${this.baseUrl}/apps/root_agent/users/${userId}/sessions/${sessionId}/messages`);

    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.statusText}`);
    }

    const data = await response.json();
    return data.messages || [];
  }

  /**
   * Get session state
   */
  async getSessionState(sessionId: string, userId: string = config.app.defaultUserId): Promise<Record<string, any>> {
    const response = await fetch(`${this.baseUrl}/apps/root_agent/users/${userId}/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error(`Failed to get session state: ${response.statusText}`);
    }

    const data = await response.json();
    return data.state || {};
  }

  /**
   * Update session state
   */
  async updateSessionState(sessionId: string, state: Record<string, any>, userId: string = config.app.defaultUserId): Promise<void> {
    const response = await fetch(`${this.baseUrl}/apps/root_agent/users/${userId}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update session state: ${response.statusText}`);
    }
  }

  /**
   * Generate a random session ID
   */
  private generateSessionId(): string {
    return 's_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get server information
   */
  async getServerInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/info`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get server info:', error);
    }
    return null;
  }
}

// Export a singleton instance
export const adkApi = new ADKApiService(); 
