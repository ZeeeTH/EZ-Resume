import fs from 'fs';
import path from 'path';

const STORE_PATH = path.resolve(process.cwd(), 'data', 'formDataStore.json');

export function saveFormData(sessionId: string, formData: any) {
  let store = {};
  if (fs.existsSync(STORE_PATH)) {
    store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
  }
  store[sessionId] = formData;
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getFormData(sessionId: string) {
  if (!fs.existsSync(STORE_PATH)) return null;
  const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
  return store[sessionId] || null;
}

export function deleteFormData(sessionId: string) {
  if (!fs.existsSync(STORE_PATH)) return;
  const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
  delete store[sessionId];
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
} 