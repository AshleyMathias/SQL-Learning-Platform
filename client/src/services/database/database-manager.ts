import type { DatabaseInfo } from '@sql-brush-up/shared';
import { SqlEngine } from './sql-engine';
import { generateId } from '@/utils';

const DB_STORAGE_KEY = 'sql-brush-up-databases';
const DB_INDEX_KEY = 'sql-brush-up-db-index';

interface StoredDatabase {
  info: DatabaseInfo;
  data: string;
}

class DatabaseManager {
  private engines = new Map<string, SqlEngine>();
  private index: DatabaseInfo[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    const stored = localStorage.getItem(DB_INDEX_KEY);
    this.index = stored ? JSON.parse(stored) : [];
    this.initialized = true;
  }

  private saveIndex(): void {
    localStorage.setItem(DB_INDEX_KEY, JSON.stringify(this.index));
  }

  private saveDatabase(id: string, engine: SqlEngine): void {
    const bytes = engine.export();
    const data = btoa(String.fromCharCode(...bytes));
    const info = this.index.find((d) => d.id === id);
    if (!info) return;
    const stored: StoredDatabase = { info, data };
    localStorage.setItem(`${DB_STORAGE_KEY}-${id}`, JSON.stringify(stored));
  }

  async listDatabases(): Promise<DatabaseInfo[]> {
    await this.initialize();
    return [...this.index];
  }

  async getEngine(id: string): Promise<SqlEngine | null> {
    await this.initialize();
    if (this.engines.has(id)) return this.engines.get(id)!;

    const storedRaw = localStorage.getItem(`${DB_STORAGE_KEY}-${id}`);
    if (!storedRaw) return null;

    const stored: StoredDatabase = JSON.parse(storedRaw);
    const binary = Uint8Array.from(atob(stored.data), (c) => c.charCodeAt(0));
    const engine = await SqlEngine.fromBytes(binary);
    this.engines.set(id, engine);
    return engine;
  }

  async createDatabase(name: string, isSample = false, sampleId?: string): Promise<DatabaseInfo> {
    await this.initialize();
    const engine = await SqlEngine.createEmpty();
    const info: DatabaseInfo = {
      id: generateId(),
      name,
      isSample,
      sampleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.index.push(info);
    this.engines.set(info.id, engine);
    this.saveIndex();
    this.saveDatabase(info.id, engine);
    return info;
  }

  async loadSampleDatabase(
    name: string,
    sampleId: string,
    schemaSql: string,
    dataSql: string
  ): Promise<DatabaseInfo> {
    const existing = this.index.find((d) => d.sampleId === sampleId);
    if (existing) return existing;

    const info = await this.createDatabase(name, true, sampleId);
    const engine = await this.getEngine(info.id);
    if (engine) {
      engine.runMultiple(schemaSql);
      engine.runMultiple(dataSql);
      this.saveDatabase(info.id, engine);
    }
    return info;
  }

  async deleteDatabase(id: string): Promise<void> {
    await this.initialize();
    const engine = this.engines.get(id);
    engine?.close();
    this.engines.delete(id);
    this.index = this.index.filter((d) => d.id !== id);
    localStorage.removeItem(`${DB_STORAGE_KEY}-${id}`);
    this.saveIndex();
  }

  async renameDatabase(id: string, newName: string): Promise<void> {
    await this.initialize();
    const db = this.index.find((d) => d.id === id);
    if (!db) return;
    db.name = newName;
    db.updatedAt = new Date().toISOString();
    this.saveIndex();
    const engine = await this.getEngine(id);
    if (engine) this.saveDatabase(id, engine);
  }

  async persistEngine(id: string): Promise<void> {
    const engine = this.engines.get(id);
    if (!engine) return;
    const db = this.index.find((d) => d.id === id);
    if (db) {
      db.updatedAt = new Date().toISOString();
      this.saveIndex();
    }
    this.saveDatabase(id, engine);
  }

  async importDatabase(name: string, bytes: Uint8Array): Promise<DatabaseInfo> {
    const engine = await SqlEngine.fromBytes(bytes);
    const info: DatabaseInfo = {
      id: generateId(),
      name,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.initialize();
    this.index.push(info);
    this.engines.set(info.id, engine);
    this.saveIndex();
    this.saveDatabase(info.id, engine);
    return info;
  }

  async exportDatabase(id: string): Promise<Uint8Array | null> {
    const engine = await this.getEngine(id);
    return engine?.export() ?? null;
  }
}

export const databaseManager = new DatabaseManager();
