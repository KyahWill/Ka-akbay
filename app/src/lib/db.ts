import Dexie, { type EntityTable } from 'dexie';

interface Session {
  id: string;
  name: string;
}

const db = new Dexie('SessionsDatabase') as Dexie & {
  sessions: EntityTable<
    Session,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  sessions: '++id,uuid, name, createdAt' // primary key "id" (for the runtime!)
});

export type { Session };
export { db };
