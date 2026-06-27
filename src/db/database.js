import Dexie from 'dexie';

export const db = new Dexie('FlexFixDB');

db.version(1).stores({
  sessions: '++id, username, createdAt',
  deliveries: '++id, sessionId, packageCode, zone, createdAt',
  packages: '++id, sessionId, packageCode, zone, delivered',
  zones: '++id, sessionId, zoneName',
  syncQueue: '++id, timestamp, synced',
});

// Tipos de tablas
export class Session extends Dexie.Table {
  sessions;
}

export class Delivery extends Dexie.Table {
  deliveries;
}

export class Package extends Dexie.Table {
  packages;
}

export class Zone extends Dexie.Table {
  zones;
}

export class SyncQueue extends Dexie.Table {
  syncQueue;
}

// Funciones de sesión
export async function createSession(username, password) {
  const sessionId = await db.sessions.add({
    username,
    passwordHash: btoa(password), // Simple encoding, en producción usar bcrypt
    createdAt: new Date(),
    lastActive: new Date(),
  });
  return sessionId;
}

export async function getSession(username) {
  return db.sessions.where('username').equals(username).first();
}

export async function getAllSessions() {
  return db.sessions.toArray();
}

// Funciones de paquetes
export async function addPackage(sessionId, packageCode, zone) {
  const id = await db.packages.add({
    sessionId,
    packageCode,
    zone,
    delivered: false,
    deliveredAt: null,
    createdAt: new Date(),
  });
  
  // Agregar a cola de sincronización
  await db.syncQueue.add({
    type: 'add_package',
    data: { sessionId, packageCode, zone },
    timestamp: new Date(),
    synced: false,
  });
  
  return id;
}

export async function markAsDelivered(packageId) {
  await db.packages.update(packageId, {
    delivered: true,
    deliveredAt: new Date(),
  });
  
  // Agregar a cola de sincronización
  await db.syncQueue.add({
    type: 'mark_delivered',
    data: { packageId },
    timestamp: new Date(),
    synced: false,
  });
}

export async function getPackagesBySession(sessionId) {
  return db.packages.where('sessionId').equals(sessionId).toArray();
}

export async function getPackagesByZone(sessionId, zone) {
  return db.packages
    .where('[sessionId+zone]')
    .equals([sessionId, zone])
    .toArray();
}

export async function getUndeliveredCount(sessionId, zone) {
  return db.packages
    .where('[sessionId+zone]')
    .equals([sessionId, zone])
    .filter(p => !p.delivered)
    .count();
}

export async function getTotalPackages(sessionId) {
  return db.packages.where('sessionId').equals(sessionId).count();
}

export async function getDeliveredCount(sessionId) {
  return db.packages
    .where('sessionId')
    .equals(sessionId)
    .filter(p => p.delivered)
    .count();
}

// Funciones de zonas
export async function initializeZones(sessionId) {
  const zones = ['A', 'B', 'C', 'D'];
  const descriptions = [
    'A - Copiloto',
    'B - Asiento trasero (izquierda)',
    'C - Asiento trasero (derecha)',
    'D - Maletero'
  ];
  
  for (let i = 0; i < zones.length; i++) {
    await db.zones.add({
      sessionId,
      zoneName: zones[i],
      description: descriptions[i],
      capacity: null,
      createdAt: new Date(),
    });
  }
}

export async function getZones(sessionId) {
  return db.zones.where('sessionId').equals(sessionId).toArray();
}

// Funciones de sincronización
export async function getSyncQueue() {
  return db.syncQueue.where('synced').equals(false).toArray();
}

export async function markAsSynced(syncQueueId) {
  await db.syncQueue.update(syncQueueId, { synced: true });
}

export async function clearOldSync(days = 7) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await db.syncQueue.where('timestamp').below(cutoff).delete();
}
