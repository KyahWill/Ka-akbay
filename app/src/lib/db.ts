import Dexie, { type EntityTable } from 'dexie';

interface Session {
  id: string;
  uuid: string;
  name: string;
  userId: string;
  sessionId: string;
  createdAt: Date;
  lastMessageAt?: Date;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const db = new Dexie('SessionsDatabase') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
  messages: EntityTable<ChatMessage, 'id'>;
};

// Schema declaration:
db.version(2).stores({
  sessions: '++id, uuid, name, userId, sessionId, createdAt, lastMessageAt, messageCount',
  messages: '++id, sessionId, content, role, timestamp'
});

// Helper functions
export const dbHelpers = {
  async createSession(sessionData: Omit<Session, 'id' | 'createdAt' | 'messageCount'>): Promise<Session> {
    const session: Session = {
      ...sessionData,
      id: sessionData.uuid,
      createdAt: new Date(),
      messageCount: 0
    };
    
    await db.sessions.add(session);
    return session;
  },

  async getSession(sessionId: string): Promise<Session | undefined> {
    return await db.sessions.where('sessionId').equals(sessionId).first();
  },

  async getAllSessions(): Promise<Session[]> {
    return await db.sessions.orderBy('lastMessageAt').reverse().toArray();
  },

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
    await db.sessions.where('sessionId').equals(sessionId).modify(updates);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await db.sessions.where('sessionId').equals(sessionId).delete();
    await db.messages.where('sessionId').equals(sessionId).delete();
  },

  async addMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
    };
    
    await db.messages.add(newMessage);
    
    // Update session message count and last message time
    const session = await db.sessions.where('sessionId').equals(message.sessionId).first();
    if (session) {
      await db.sessions.where('sessionId').equals(message.sessionId).modify({
        messageCount: session.messageCount + 1,
        lastMessageAt: new Date()
      });
    }
    
    return newMessage;
  },

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.messages.where('sessionId').equals(sessionId).toArray();
  },

  async deleteSessionMessages(sessionId: string): Promise<void> {
    await db.messages.where('sessionId').equals(sessionId).delete();
  }
};

export type { Session, ChatMessage };
export { db };
