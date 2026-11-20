'use strict';
/*
 * Punto de venta - Taquería "El Vergel"
 * Servidor de sincronización en red local (LAN).
 *
 * Solo usa módulos incluidos de Node.js (http, fs, path, os): sin dependencias.
 * Uso:
 *   node server.js [puerto]          (puerto por defecto: 8080)
 *   PORT=8081 node server.js
 *
 * Qué hace:
 * - Sirve la app (index.html) en la red local para que la computadora y las
 *   tablets la abran desde el navegador.
 * - Guarda el estado autoritativo en data.json con escritura ATÓMICA
 *   (archivo temporal + fsync + rename) y mantiene un respaldo
 *   data.json.bak con la última copia buena. Un corte de luz a mitad de una
 *   escritura nunca corrompe el archivo.
 * - Sincroniza dispositivos con SSE (eventos) + POST (mutaciones), sin
 *   librerías externas. La computadora (localhost) administra todo; las
 *   tablets se registran con permisos limitados (ver README).
 * - La impresión de tickets sigue siendo LOCAL en cada dispositivo.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8080', 10);
const DATA_DIR = process.env.PV_DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const BAK_FILE = DATA_FILE + '.bak';

/* Permisos por defecto para un dispositivo nuevo (tablet que solo manda
 * comandas): puede ver todo y crear/cambiar comandas, nada más. */
const DEFAULT_PERMS = { pos: true, comandas: true, cobrar: false, cortes: false, ventas: false, configuracion: false };
const FULL_PERMS = { pos: true, comandas: true, cobrar: true, cortes: true, ventas: true, configuracion: true };

/* Catálogo por defecto (copia de seguridad: solo se usa si el servidor nace
 * vacío y ningún cliente ha mandado todavía su catálogo). */
const DEFAULT_CATALOG = [
  { id: 'tacos', label: 'Tacos', sections: [
    { id: 'ordenes', label: 'Órdenes', items: [
      { id: 'suadero',    name: 'Orden de suadero',    price: 130, color: '#1e5631' },
      { id: 'cuero',      name: 'Orden de cuero',      price: 130, color: '#276749' },
      { id: 'adobada',    name: 'Orden de adobada',    price: 130, color: '#2f855a' },
      { id: 'campechano', name: 'Orden de campechano', price: 130, color: '#38a169' },
    ]},
    { id: 'individual', label: 'Taco individual', items: [
      { id: 'suadero-ind',    name: 'Taco de suadero',    price: 32.50, color: '#1e5631' },
      { id: 'cuero-ind',      name: 'Taco de cuero',      price: 32.50, color: '#276749' },
      { id: 'adobada-ind',    name: 'Taco de adobada',    price: 32.50, color: '#2f855a' },
      { id: 'campechano-ind', name: 'Taco de campechano', price: 32.50, color: '#38a169' },
    ]},
  ]},
  { id: 'bebidas', label: 'Bebidas', sections: [
    { id: 'refrescos', label: 'Refrescos', items: [
      { id: 'coca',   name: 'Coca Cola', price: 30, color: '#2d7d46' },
      { id: 'sprite', name: 'Sprite',    price: 30, color: '#43a047' },
      { id: 'fanta',  name: 'Fanta',     price: 30, color: '#558b2f' },
    ]},
    { id: 'aguas', label: 'Aguas', items: [
      { id: 'jamaica',  name: 'Agua de Jamaica', price: 30, color: '#1b5e20' },
      { id: 'limon',    name: 'Agua de limón',   price: 30, color: '#33691e' },
      { id: 'horchata', name: 'Agua de horchata', price: 30, color: '#2e7d32' },
    ]},
  ]},
  { id: 'otros', label: 'Otros', sections: [
    { id: 'otros', label: null, items: [
      { id: 'dulce', name: 'Dulce', price: 2, color: '#558b2f' },
    ]},
  ]},
];

function emptyState() {
  return {
    catalog: JSON.parse(JSON.stringify(DEFAULT_CATALOG)),
    comandas: [],
    comandaSeq: 0,
    sales: [],
    session: null,
    cortes: [],
    lastCorteIndex: 0,
    devices: [],
    sucursalSuffix: ''
  };
}

function normalizeSeed(s) {
  s = (s && typeof s === 'object') ? s : {};
  return {
    catalog: Array.isArray(s.catalog) && s.catalog.length ? s.catalog : JSON.parse(JSON.stringify(DEFAULT_CATALOG)),
    comandas: Array.isArray(s.comandas) ? s.comandas : [],
    comandaSeq: typeof s.comandaSeq === 'number' && s.comandaSeq >= 0 ? s.comandaSeq : 0,
    sales: Array.isArray(s.sales) ? s.sales : [],
    session: (s.session && typeof s.session === 'object') ? s.session : null,
    cortes: Array.isArray(s.cortes) ? s.cortes : [],
    lastCorteIndex: typeof s.lastCorteIndex === 'number' && s.lastCorteIndex >= 0 ? s.lastCorteIndex : 0,
    devices: Array.isArray(s.devices) ? s.devices : [],
    sucursalSuffix: typeof s.sucursalSuffix === 'string' ? s.sucursalSuffix : ''
  };
}

/* ---------- Persistencia atómica + respaldo ---------- */

/* Escribe `content` en `file` de forma atómica: primero a un archivo
 * temporal en el mismo directorio, fsync al disco y luego rename. Si se va
 * la luz a mitad, `file` queda intacto (viejo o nuevo, nunca a medias) y el
 * .tmp huérfano se ignora al arrancar. */
function atomicWrite(file, content) {
  const tmp = file + '.tmp';
  const fd = fs.openSync(tmp, 'w');
  try {
    fs.writeSync(fd, content);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp, file);
}

function persist(store) {
  const payload = JSON.stringify({ version: store.version, data: store.data }, null, 2);
  atomicWrite(DATA_FILE, payload);
  /* Respaldo rodante: data.json.bak guarda la última copia buena (la misma
   * que acaba de quedar en data.json). Si data.json se corrompe algún día,
   * el servidor arranca desde aquí en vez de empezar vacío. */
  atomicWrite(BAK_FILE, payload);
}

function loadStore() {
  for (const f of [DATA_FILE, BAK_FILE]) {
    try {
      const raw = fs.readFileSync(f, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.version === 'number' && parsed.data && typeof parsed.data === 'object') {
        return parsed;
      }
    } catch (e) { /* archivo ilegible o corrupto: probar el siguiente */ }
  }
  return { version: 0, data: emptyState() };
}

/* ---------- Utilidades ---------- */

function isLoopback(req) {
  const ip = req.socket.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function devicePerms(data, deviceId) {
  if (!deviceId) return null;
  const d = (data.devices || []).find(x => x && x.id === deviceId);
  return d ? (d.permisos || {}) : null;
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function lanUrls(port) {
  const urls = [];
  const ifs = os.networkInterfaces();
  for (const name of Object.keys(ifs)) {
    for (const a of ifs[name] || []) {
      if (a.family === 'IPv4' && !a.internal) urls.push('http://' + a.address + ':' + port + '/');
    }
  }
  return urls;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > 5 * 1024 * 1024) { reject(httpError(413, 'cuerpo demasiado grande')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(httpError(400, 'JSON inválido')); }
    });
    req.on('error', reject);
  });
}

/* ---------- Operaciones (mutaciones) ---------- */

const OPS = {
  'comanda.create': { perm: 'comandas', apply(data, p) {
    if (!p.comanda || typeof p.comanda !== 'object') throw httpError(400, 'falta la comanda');
    const c = Object.assign({}, p.comanda);
    data.comandaSeq = (data.comandaSeq || 0) + 1;
    c.id = data.comandaSeq;
    data.comandas.push(c);
    return { comanda: c };
  }},
  'comanda.status': { perm: 'comandas', apply(data, p) {
    const c = (data.comandas || []).find(x => x.id === p.id);
    if (!c) throw httpError(404, 'comanda no encontrada');
    c.status = p.status;
    return { comanda: c };
  }},
  'comanda.pay': { perm: 'cobrar', apply(data, p) {
    const idx = (data.comandas || []).findIndex(x => x.id === p.id);
    if (idx === -1) throw httpError(404, 'comanda no encontrada');
    if (!p.venta || typeof p.venta !== 'object') throw httpError(400, 'falta la venta');
    data.comandas.splice(idx, 1);
    data.sales.push(p.venta);
    return {};
  }},
  'ventas.clear': { perm: 'configuracion', apply(data) {
    data.sales = [];
    return {};
  }},
  'catalog.set': { perm: 'configuracion', apply(data, p) {
    if (!Array.isArray(p.catalog)) throw httpError(400, 'catálogo inválido');
    data.catalog = p.catalog;
    return {};
  }},
  'devices.set': { perm: 'configuracion', apply(data, p) {
    if (!Array.isArray(p.devices)) throw httpError(400, 'dispositivos inválidos');
    data.devices = p.devices;
    return {};
  }},
  'sucursal.set': { perm: 'configuracion', apply(data, p) {
    data.sucursalSuffix = typeof p.suffix === 'string' ? p.suffix : '';
    return {};
  }},
  'session.set': { perm: 'cortes', apply(data, p) {
    data.session = (p.session && typeof p.session === 'object') ? p.session : null;
    return {};
  }},
  'cortes.set': { perm: 'cortes', apply(data, p) {
    if (!Array.isArray(p.cortes)) throw httpError(400, 'cortes inválidos');
    data.cortes = p.cortes;
    return {};
  }},
  'lastCorteIndex.set': { perm: 'cortes', apply(data, p) {
    data.lastCorteIndex = typeof p.value === 'number' ? p.value : 0;
    return {};
  }},
  'corte.x': { perm: 'cortes', apply(data, p) {
    if (!p.corte || typeof p.corte !== 'object') throw httpError(400, 'falta el corte');
    data.cortes.push(p.corte);
    return {};
  }},
  'corte.z': { perm: 'cortes', apply(data, p) {
    if (!p.corte || typeof p.corte !== 'object') throw httpError(400, 'falta el corte');
    data.cortes.push(p.corte);
    if (typeof p.lastCorteIndex === 'number') data.lastCorteIndex = p.lastCorteIndex;
    data.session = null;
    return {};
  }},
  'state.seed': { perm: null, apply(data, p, store) {
    if (store.version !== 0) throw httpError(409, 'el servidor ya tiene datos');
    const seeded = normalizeSeed(p.state);
    for (const k of Object.keys(seeded)) data[k] = seeded[k];
    return {};
  }},
};

/* ---------- Servidor ---------- */

function createServer(opts) {
  opts = opts || {};
  const port = opts.port || PORT;
  const dataDir = opts.dataDir || DATA_DIR;
  const dataFile = path.join(dataDir, 'data.json');
  const bakFile = dataFile + '.bak';
  const store = loadStoreFrom(dataFile, bakFile);
  const sseClients = new Set();

  function loadStoreFrom(df, bf) {
    for (const f of [df, bf]) {
      try {
        const raw = fs.readFileSync(f, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.version === 'number' && parsed.data && typeof parsed.data === 'object') {
          return parsed;
        }
      } catch (e) { /* probar el siguiente */ }
    }
    return { version: 0, data: emptyState() };
  }

  function persistStore() {
    const payload = JSON.stringify({ version: store.version, data: store.data }, null, 2);
    atomicWrite(dataFile, payload);
    atomicWrite(bakFile, payload);
  }

  function broadcast() {
    const payload = JSON.stringify({ version: store.version, state: store.data });
    for (const res of sseClients) {
      try { res.write('event: state\ndata: ' + payload + '\n\n'); } catch (e) { /* cliente caído */ }
    }
  }

  function ensureDevice(deviceId) {
    if (!deviceId) return null;
    let perms = devicePerms(store.data, deviceId);
    if (!perms) {
      store.data.devices.push({
        id: deviceId,
        nombre: 'Dispositivo nuevo',
        tipo: 'Otro',
        permisos: Object.assign({}, DEFAULT_PERMS)
      });
      perms = devicePerms(store.data, deviceId);
    }
    return perms;
  }

  const STATIC = {
    '/': { file: 'index.html', type: 'text/html; charset=utf-8' },
    '/index.html': { file: 'index.html', type: 'text/html; charset=utf-8' },
    '/README.md': { file: 'README.md', type: 'text/plain; charset=utf-8' }
  };

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathname = url.pathname;

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
      }

      /* Archivos de la app */
      if (req.method === 'GET' && STATIC[pathname]) {
        const entry = STATIC[pathname];
        const filePath = path.join(__dirname, entry.file);
        fs.readFile(filePath, (err, buf) => {
          if (err) { res.writeHead(404); res.end('no encontrado'); return; }
          res.writeHead(200, { 'Content-Type': entry.type, 'Cache-Control': 'no-cache' });
          res.end(buf);
        });
        return;
      }

      /* Estado completo (lectura para cualquier dispositivo) */
      if (req.method === 'GET' && pathname === '/state') {
        sendJson(res, 200, { version: store.version, state: store.data });
        return;
      }

      /* Información del servidor (URLs LAN para compartir) */
      if (req.method === 'GET' && pathname === '/info') {
        sendJson(res, 200, { port: port, lanUrls: lanUrls(port), version: store.version });
        return;
      }

      /* Eventos en vivo (SSE) */
      if (req.method === 'GET' && pathname === '/events') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });
        res.write('event: state\ndata: ' + JSON.stringify({ version: store.version, state: store.data }) + '\n\n');
        sseClients.add(res);
        const hb = setInterval(() => {
          try { res.write(': ping\n\n'); } catch (e) { /* cliente caído */ }
        }, 25000);
        req.on('close', () => {
          clearInterval(hb);
          sseClients.delete(res);
        });
        return;
      }

      /* Registro de dispositivo: devuelve sus permisos */
      if (req.method === 'POST' && pathname === '/register') {
        const body = await readBody(req);
        if (isLoopback(req)) {
          sendJson(res, 200, { ok: true, isAdmin: true, permissions: Object.assign({}, FULL_PERMS) });
          return;
        }
        const deviceId = body.deviceId || '';
        if (!deviceId) throw httpError(400, 'falta deviceId');
        const perms = ensureDevice(deviceId);
        persistStore();
        broadcast();
        sendJson(res, 200, { ok: true, isAdmin: false, permissions: perms });
        return;
      }

      /* Mutaciones */
      if (req.method === 'POST' && pathname === '/mutate') {
        const body = await readBody(req);
        const op = body.op;
        const def = OPS[op];
        if (!def) throw httpError(400, 'operación desconocida: ' + op);
        const payload = body.payload || {};
        const deviceId = body.deviceId || '';

        if (op === 'state.seed') {
          if (store.version !== 0) throw httpError(409, 'el servidor ya tiene datos');
          def.apply(store.data, payload, store);
          store.version += 1;
          persistStore();
          broadcast();
          sendJson(res, 200, { ok: true, version: store.version, state: store.data, result: {} });
          return;
        }

        if (!isLoopback(req)) {
          if (!deviceId) throw httpError(400, 'falta deviceId');
          ensureDevice(deviceId);
        }
        if (!isLoopback(req) && def.perm) {
          const perms = devicePerms(store.data, deviceId);
          if (!perms || !perms[def.perm]) {
            sendJson(res, 403, { ok: false, error: 'sin permiso' });
            return;
          }
        }

        const result = def.apply(store.data, payload, store);
        store.version += 1;
        persistStore();
        broadcast();
        sendJson(res, 200, { ok: true, version: store.version, state: store.data, result: result || {} });
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('no encontrado');
    } catch (e) {
      const status = e.status || 500;
      sendJson(res, status, { ok: false, error: e.message || 'error interno' });
    }
  });

  server.store = store;
  server.sseClients = sseClients;
  return server;
}

/* ---------- Arranque ---------- */

function start() {
  const server = createServer({});
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error('El puerto ' + PORT + ' ya está en uso. Prueba con otro puerto:  node server.js 8081');
    } else {
      console.error('Error del servidor:', err.message);
    }
    process.exit(1);
  });
  server.listen(PORT, () => {
    const urls = lanUrls(PORT);
    console.log('========================================');
    console.log('  Punto de venta - Taquería "El Vergel"');
    console.log('  Servidor de sincronización en red');
    console.log('========================================');
    console.log('En esta computadora abre:');
    console.log('  http://localhost:' + PORT + '/');
    if (urls.length) {
      console.log('En tablets y celulares (misma Wi-Fi) abre:');
      urls.forEach(u => console.log('  ' + u));
    } else {
      console.log('(No se detectaron direcciones de red local; abre la IP de la computadora manualmente.)');
    }
    console.log('Datos guardados en: ' + DATA_FILE);
    console.log('Deja esta ventana abierta mientras uses la app. Ctrl+C para salir.');
  });
}

if (require.main === module) start();

module.exports = { createServer, emptyState, DEFAULT_PERMS, FULL_PERMS };
